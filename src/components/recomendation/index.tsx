import { Button, Card, Input, InputNumber, notification } from "antd";
import { FC, useEffect, useState } from "react";
import { IOrders, IStock } from "../../types/types";
import ordersData from "../../assets/orders.json";
import stocksJSON from "../../assets/stocks.json";
import { OKRUGA } from "../../constants";
import { utils, writeFile } from "xlsx";
import { getDate } from "../../helpers/utils";

interface IRegion {
  name: string;
  nonLocalPercent: number;
  items: Array<{
    barcode: string;
    quantity: number;
    orderSpeed: number;
    quantityToIncome: number;
  }>;
}

const gridStyle: React.CSSProperties = {
  width: "25%",
  textAlign: "center",
};

const Recomendations: FC = () => {
  const [key, setKey] = useState("");
  const [days, setDays] = useState(14);
  const [daysToHave, setdaysToHave] = useState(30);

  const getStocks = (localOrders: IOrders[], stocksData: IStock[]) => {
    const localStocks = [
      ...new Set(localOrders?.map((item) => item.warehouseName)),
    ];

    const emptyStocks: Array<Omit<IRegion, "nonLocalPercent">> =
      localStocks.map((stock) => ({
        name: stock,
        items: [],
      }));

    // Сколько и каких товаров было заказано на складе
    localOrders.forEach((order) => {
      const stock = emptyStocks.find((el) => el.name == order.warehouseName);
      if (stock) {
        const item = stock.items.find(
          (element) => element.barcode == order.barcode
        );
        if (item) item.quantity += 1;
        else {
          stock.items.push({
            barcode: order.barcode,
            quantity: 1,
            orderSpeed: 0,
            quantityToIncome: 0,
          });
        }
      }
    });

    emptyStocks.forEach((stock) => {
      stock.items.forEach((barcode) => {
        const speed = barcode.quantity / days;
        const required = daysToHave * speed;
        stocksData.forEach((stockDataItem) => {
          if (
            stockDataItem.warehouseName === stock.name &&
            stockDataItem.barcode === barcode.barcode
          ) {
            barcode.quantity += stockDataItem.quantity;
          }
        });

        barcode.orderSpeed = speed;
        barcode.quantityToIncome =
          required < barcode.quantity ? 0 : required - barcode.quantity;
      });
    });

    return emptyStocks;
  };

  const getRegions = (ordersList: IOrders[], nonLocalOrders: IOrders[]) => {
    const nonLocalRegions = [
      ...new Set(nonLocalOrders?.map((item) => item.oblastOkrugName)),
    ];

    const emptyRegions: IRegion[] = nonLocalRegions.map((region) => ({
      name: region,
      nonLocalPercent: 0,
      items: [],
    }));
    // Сколько и каких товаров было заказано не из этого региона
    nonLocalOrders.forEach((order) => {
      const region = emptyRegions.find(
        (el) => el.name == order.oblastOkrugName
      );
      if (region) {
        const item = region.items.find(
          (element) => element.barcode == order.barcode
        );
        if (item) item.quantity += 1;
        else {
          region.items.push({
            barcode: order.barcode,
            quantity: 1,
            orderSpeed: 0,
            quantityToIncome: 0,
          });
        }
      }
    });

    emptyRegions.forEach((region) => {
      region.items.forEach((barcode) => {
        barcode.orderSpeed = barcode.quantity / days;
        barcode.quantityToIncome = (barcode.quantity / days) * daysToHave;
      });
    });

    emptyRegions.forEach((region) => {
      // Общее количество нелокальных заказов в регионе по всем товарам
      let total: number = 0;
      region.items.forEach((it) => {
        total += it.quantity;
      });
      region.nonLocalPercent =
        ordersList.length > 0 ? total / ordersList.length : 0;
    });

    return emptyRegions;
  };

  const getOrders = (ordersList: IOrders[]) => {
    const nonLocalOrders: IOrders[] = [];
    const localOrders: IOrders[] = [];
    ordersList.forEach((order) => {
      let isLocal = false;
      // Проверка склада на принадлежность округу
      if (
        OKRUGA.find(
          (okrug) =>
            okrug.name.toLowerCase() == order.oblastOkrugName.toLowerCase()
        )?.warehouses.find((el) => {
          return el.toLowerCase() == order.warehouseName.toLowerCase();
        })
      ) {
        isLocal = true;
      }

      isLocal ? localOrders.push(order) : nonLocalOrders.push(order);
    });
    // setLocalIndex(
    //   Number(((1 - nonLocalOrders.length / ordersList.length) * 100).toFixed(2))
    // );

    return { nonLocalOrders, localOrders };
  };

  const getRegionsAndStocks = async () => {
    try {
      const nwb = utils.book_new();

      const ordersList: IOrders[] = (await (
        await fetch(
          `https://statistics-api.wildberries.ru/api/v1/supplier/orders?dateFrom=${getDate(
            days
          )}`,
          {
            headers: {
              Authorization: key,
            },
          }
        )
      ).json()) as unknown as IOrders[];
      const stocksList: IStock[] = (await (
        await fetch(
          "https://statistics-api.wildberries.ru/api/v1/supplier/stocks?dateFrom=2019-06-20",
          {
            headers: {
              Authorization: key,
            },
          }
        )
      ).json()) as unknown as IStock[];

      const { nonLocalOrders, localOrders } = getOrders(ordersList);
      const regions = getRegions(ordersList, nonLocalOrders);
      const stocks = getStocks(localOrders, stocksList);

      stocks.forEach((stock) => {
        const resultArray: Array<Array<string>> = [];
        resultArray.push([stock.name]);
        let sum = 0;
        stock.items.forEach((item) => {
          sum += item.quantityToIncome;
          resultArray.push([item.barcode, item.quantityToIncome.toFixed(0)]);
        });
        resultArray.push(["Итого:", sum.toFixed(0)]);
        const nws = utils.aoa_to_sheet(resultArray);
        utils.book_append_sheet(nwb, nws, stock.name.slice(0, 20));
      });
      regions.forEach((region) => {
        const resultArray: Array<Array<string>> = [];
        resultArray.push([region.name]);
        let sum = 0;
        region.items.forEach((item) => {
          sum += item.quantityToIncome;
          resultArray.push([item.barcode, item.quantityToIncome.toFixed(0)]);
        });
        resultArray.push([
          "Итого:",
          sum.toFixed(0),
          "Нелокальных заказов:",
          (region.nonLocalPercent * 100).toFixed(2),
        ]);
        const nws = utils.aoa_to_sheet(resultArray);
        utils.book_append_sheet(nwb, nws, region.name.slice(0, 20));
      });

      // Печать
      writeFile(nwb, "отчет.xlsx");
    } catch (error) {
      notification.error({
        placement: "topRight",
        duration: 5,
        message: String(error),
      });
    }
  };
  return (
    <Card
      title="Отчет-рекомендация"
      style={{ display: "flex", flexDirection: "row", flexWrap: "nowrap" }}
      styles={{ body: { width: "100%" } }}
    >
      <Card.Grid hoverable={false} style={gridStyle}>
        <span>API Статистика</span>
        <Input
          type="password"
          placeholder="API-Stats key"
          style={{
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
          }}
          value={key}
          onChange={(e) => setKey(e.target.value)}
        />
      </Card.Grid>
      <Card.Grid hoverable={false} style={gridStyle}>
        <span>Период анализа, дни</span>

        <InputNumber
          min={0}
          max={30}
          style={{ margin: "0 16px" }}
          step={1}
          value={days}
          onChange={(e) => setDays(e ?? 14)}
        />
      </Card.Grid>
      <Card.Grid hoverable={false} style={gridStyle}>
        <span>Количество дней запаса, дни</span>
        <InputNumber
          min={0}
          max={150}
          style={{ margin: "0 16px" }}
          step={1}
          value={daysToHave}
          onChange={(e) => setdaysToHave(e ?? 30)}
        />
      </Card.Grid>
      <Card.Grid hoverable={false} style={gridStyle}>
        <Button
          style={{
            backgroundColor: "#1677ff",
            color: "white",
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
          }}
          onClick={getRegionsAndStocks}
        >
          Скачать отчет
        </Button>
      </Card.Grid>
    </Card>
  );
};

export { Recomendations };
