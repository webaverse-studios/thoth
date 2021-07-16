import { DataControl } from "../plugins/inspectorPlugin";

export class InputControl extends DataControl {
  constructor({ dataKey, name }) {
    const options = {
      dataKey: dataKey,
      name: name,
      controls: {
        component: "input",
      },
    };

    super(options);
  }

  onData(data) {
    return;
  }
}