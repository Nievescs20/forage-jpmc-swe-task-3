import { ServerRespond } from "./DataStreamer";

// Updated to determine the structure of the object returned by generateRow function
// In this case the row interface has to match the schema of the table in Graph.tsx
export interface Row {
  price_abc: number;
  price_def: number;
  ratio: number;
  timestamp: Date;
  upper_bound: number;
  lower_bound: number;
  trigger_alert: number | undefined;
}

export class DataManipulator {
  // Updated to properly process raw server data
  static generateRow(serverRespond: ServerRespond[]): Row {
    // serverRespond[0] refers to stock "ABC" and serverRespond [1] refers to stock "DEF"
    const priceABC =
      (serverRespond[0].top_ask.price + serverRespond[0].top_bid.price) / 2;
    const priceDEF =
      (serverRespond[1].top_ask.price + serverRespond[1].top_bid.price) / 2;
    const ratio = priceABC / priceDEF;
    const upperBound = 1 + 0.1;
    const lowerBound = 1 - 0.1;
    return {
      price_abc: priceABC,
      price_def: priceDEF,
      ratio,
      timestamp:
        serverRespond[0].timestamp > serverRespond[1].timestamp
          ? serverRespond[0].timestamp
          : serverRespond[1].timestamp,
      upper_bound: upperBound,
      lower_bound: lowerBound,
      trigger_alert:
        ratio > upperBound || ratio < lowerBound ? ratio : undefined,
    };
  }
}
