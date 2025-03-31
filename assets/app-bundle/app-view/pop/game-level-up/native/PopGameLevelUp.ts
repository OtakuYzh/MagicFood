import { _decorator, Node } from 'cc';
import BaseView from '../../../../../../extensions/app/assets/base/BaseView';
import { ecs, filter, NodeComponent } from 'db://assets/pkg-export/@gamex/cc-ecs';
import { PlayerComponent } from '../../../page/game/native/expansion/ecs/component/PlayerComponent';
import { EventTouch } from 'cc';
const { ccclass, property } = _decorator;
@ccclass('PopGameLevelUp')
export class PopGameLevelUp extends BaseView {

    // 初始化的相关逻辑写在这
    onLoad() {}

    // 界面打开时的相关逻辑写在这(onShow可被多次调用-它与onHide不成对)
    onShow(params: any) {}

    // 界面关闭时的相关逻辑写在这(已经关闭的界面不会触发onHide)
    onHide(result: undefined) {
        // app.manager.ui.show<PopGameLevelUp>({name: 'PopGameLevelUp', onHide:(result) => { 接收到return的数据，并且有类型提示 }})
        return result;
    }

    onClickSelect(event: EventTouch, index: string) {
        const player = ecs.find(filter.all(PlayerComponent, NodeComponent)).get(PlayerComponent);
        switch (index) {
            case "attack":
                player.attack += 1;
                break;
            case "split":
                player.split += 1;
                break;
            case "aspd":
                player.aspd += 1;
                break;
        }
        this.hide();
    }
}
