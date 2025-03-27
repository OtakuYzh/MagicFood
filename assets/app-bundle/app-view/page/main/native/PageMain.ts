import { _decorator, Node } from 'cc';
import BaseView from '../../../../../../extensions/app/assets/base/BaseView';
import { IMiniViewNames } from '../../../../../app-builtin/app-admin/executor';
import { app } from 'db://assets/app/app';
const { ccclass, property } = _decorator;
@ccclass('PageMain')
export class PageMain extends BaseView {
    // 子界面列表，数组顺序为子界面排列顺序
    protected miniViews: IMiniViewNames = [];
    // 初始化的相关逻辑写在这
    onLoad() {}

    // 界面打开时的相关逻辑写在这(onShow可被多次调用-它与onHide不成对)
    onShow(params: any) { this.showMiniViews({ views: this.miniViews }); }

    // 界面关闭时的相关逻辑写在这(已经关闭的界面不会触发onHide)
    onHide(result: undefined) {
        // app.manager.ui.show<PageMain>({name: 'PageMain', onHide:(result) => { 接收到return的数据，并且有类型提示 }})
        return result;
    }

    onClickStart() {
        app.manager.ui.show({
            name: 'PageGame'
        })
    }
}
