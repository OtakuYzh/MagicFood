import { _decorator, Node } from 'cc';
import BaseView from '../../../../../../../extensions/app/assets/base/BaseView';
import { app } from 'db://assets/app/app';
import { GameController } from 'db://assets/app-builtin/app-controller/GameController';
import { Label } from 'cc';
import { Graphics } from 'cc';
import { view } from 'cc';
const { ccclass, property } = _decorator;
@ccclass('PaperGamePer')
export class PaperGamePer extends BaseView.BindController(GameController) {

    @property(Label)
    private lblExp: Label;

    @property(Node)
    private aoa: Node;

    @property(Node)
    private showAoaButton: Node;

    // 初始化的相关逻辑写在这
    onLoad() {
        this.controller.on(GameController.Event.ExpVal, this.onExpVal, this);
        const g = this.aoa.getComponent(Graphics);
        g.fillColor.fromHEX('#FF9C9C40');
        const win = view.getVisibleSize();
        g.moveTo(-win.width / 2, -win.height / 2);
        g.lineTo(win.width / 2, -win.height / 2);
        g.lineTo(win.width / 2, -win.height / 2 + 800);
        g.lineTo(-win.width / 2, -win.height / 2 + 800);
        g.close();
        g.stroke();
        g.fill();
        this.aoa.active = false;
        this.showAoaButton.on(Node.EventType.TOUCH_START, this.onShowAoa, this);
        this.showAoaButton.on(Node.EventType.TOUCH_END, this.onHideAoa, this);
        this.showAoaButton.on(Node.EventType.MOUSE_LEAVE, this.onHideAoa, this);
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

    onShowAoa() {
        this.aoa.active = true;
    }

    onHideAoa() {
        this.aoa.active = false;
    }

}
