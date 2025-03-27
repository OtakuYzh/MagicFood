import BaseController from '../../../extensions/app/assets/base/BaseController';
import { PlayerComponent } from '../../app-bundle/app-view/page/game/native/expansion/ecs/component/PlayerComponent';
export class GameController extends BaseController<GameController, {
    // 定义了事件，并同时定义参数列表和返回值
    // Refresh: (a: number) => boolean
    Shoot: (player: PlayerComponent) => void;
}>() {
    // Controller中发射事件, UI中监听事件:
    // 1、UI中需要将 「extends BaseView」 改为=> 「extends BaseView.bindController(GameController)」
    // 2、UI中使用「this.controller.on/once」监听事件, 使用「this.controller.emit」发射事件, 使用「this.controller.off/targetOff」取消监听事件
    // 3、在外部(无法使用this.controller的地方)可以通过「app.controller.xxx」来调用对外导出的方法, 比如下面的refresh方法
    // refresh() {
    //     this.emit(GameController.Event.Refresh, 1000); // 参数类型正确
    //     this.emit(GameController.Event.Refresh, true); // 参数类型错误
    //     const result = this.call(GameController.Event.Refresh, 1000); // 自动推导返回值类型
    // }
    shoot(player: PlayerComponent) {
        this.emit(GameController.Event.Shoot, player);
    }
}
