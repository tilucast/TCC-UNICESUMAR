type IconName =
  | "lava-lamp"
  | "battery"
  | "newspaper"
  | "calculator"
  | "food"
  | "oil";

interface Item {
  name: IconName;
  title: string;
  id: number;
}

export { IconName, Item };
