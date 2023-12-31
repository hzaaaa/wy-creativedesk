import { App } from "vue";
import check from "./check";
import permission from "./permission";
import debounce from "./debounce";
import throttle from "./throttle";
import sticky from "./sticky";

const directivesList: any = {
  check,
  permission,
  debounce,
  throttle,
  sticky,
};

const directives = {
  install: function (app: App<Element>) {
    Object.keys(directivesList).forEach((key) => {
      // 注册所有自定义指令
      app.directive(key, directivesList[key]);
    });
  },
};

export default directives;
