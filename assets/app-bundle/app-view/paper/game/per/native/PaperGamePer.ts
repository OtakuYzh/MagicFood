import { _decorator, Node } from 'cc';
import BaseView from '../../../../../../../extensions/app/assets/base/BaseView';
import { app } from 'db://assets/app/app';
import { GameController } from 'db://assets/app-builtin/app-controller/GameController';
import { Label } from 'cc';
const { ccclass, property } = _decorator;
@ccclass('PaperGamePer')
export class PaperGamePer extends BaseView.BindController(GameController) {

    @property(Label)
    private lblExp: Label;

    // 初始化的相关逻辑写在这
    onLoad() {
        this.controller.on(GameController.Event.ExpVal, this.onExpVal, this);
    }

    // 界面打开时的相关逻辑写在这(onShow可被多次调用-它与onHide不成对)
    onShow(params: any) {}

    // 界面关闭时的相关逻辑写在这(已经关闭的界面不会触发onHide)
    onHide(result: undefined) {
        // app.manager.ui.show<PaperGamePer>({name: 'PaperGamePer', onHide:(result) => { 接收到return的数据，并且有类型提示 }})
        this.controller.targetOff(this);
        return result;
    }

    private onExpVal(exp: number) {
        this.lblExp.string = `Exp: ${exp}`;
    }

    onClickPause() {
        app.manager.ui.show({
            name: 'PopGamePause'
        })
    }

}
