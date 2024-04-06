import { Button, Input, InputNumber } from "antd";
import { FC, useState } from "react";
import { IOrders } from "../../types/types";
import ordersData from "../../assets/orders.json";
import { OKRUGA } from "../../constants";

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

const Recomendations: FC = () => {
  const [key, setKey] = useState("");
  const [days, setDays] = useState(14);
  const [daysToHave, setdaysToHave] = useState(30);

  const getNonLocalOrders = async (ordersList: IOrders[]) => {
    const nonLocalOrders: IOrders[] = [];
    ordersList.forEach((order) => {
      let isLocal = false;
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

      isLocal ? null : nonLocalOrders.push(order);
    });
    // setLocalIndex(
    //   Number(((1 - nonLocalOrders.length / ordersList.length) * 100).toFixed(2))
    // );

    return nonLocalOrders;
  };

  const getNonLocalRegions = async () => {
    const ordersList: IOrders[] = ordersData as IOrders[];

    const nonLocalOrders = await getNonLocalOrders(ordersList);

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
  return (
    <div style={{ display: "flex", flexDirection: "row" }}>
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
      <InputNumber
        min={0}
        max={30}
        style={{ margin: "0 16px" }}
        step={1}
        value={days}
        onChange={(e) => setDays(e ?? 14)}
      />
      <InputNumber
        min={0}
        max={150}
        style={{ margin: "0 16px" }}
        step={1}
        value={daysToHave}
        onChange={(e) => setdaysToHave(e ?? 30)}
      />
      <Button
        style={{
          backgroundColor: "#1677ff",
          color: "white",
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
        }}
        onClick={() => console.log(getNonLocalRegions())}
      >
        Расчитать сколько нужно заказать
      </Button>
    </div>
  );
};

export { Recomendations };
