import api from "./api";
import { ICalcEvent } from "./api/interfaces/ICalcEvent";
import { ICalcEventListener } from "./api/interfaces/ICalcEventListener";

export const testCalculateSdk = async () => {
  //----
  // HTTP PROTOCOL
  //---
  // CALL HEALTH CHECK API
  console.log(
    await api.functional.calculate.health({
      host: "http://127.0.0.1:37000",
    })
  );

  //----
  // WEBSOCKET PROTOCOL
  //---
  // PROVIDER FOR WEBSOCKET SERVER
  const stack: ICalcEvent[] = [];
  const listener: ICalcEventListener = {
    on: (evt: ICalcEvent) => stack.push(evt),
  };

  // DO CONNECT
  const { connector, driver } = await api.functional.calculate.composite(
    {
      host: "ws://127.0.0.1:37000",
      headers: {
        precision: 2,
      },
    },
    listener
  );

  // CALL FUNCTIONS OF REMOTE SERVER
  console.log(
    await driver.plus(10, 20), // returns 30
    await driver.multiplies(3, 4), // returns 12
    await driver.divides(5, 3), // returns 1.67
    await driver.scientific.sqrt(2), // returns 1.41
    await driver.statistics.mean(1, 3, 9) // returns 4.33
  );

  // TERMINATE
  await connector.close();
  console.log(stack);
};
