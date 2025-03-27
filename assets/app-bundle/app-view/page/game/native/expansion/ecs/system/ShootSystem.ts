import { EcsSystem, filter } from "db://assets/pkg-export/@gamex/cc-ecs";
import { PlayerComponent } from "../component/PlayerComponent";
import { app } from "db://assets/app/app";

/**
 * 射击系统
 * 玩家组件
 */
export class ShootSystem extends EcsSystem {
    private playerFilter = filter.all(PlayerComponent);

    private shootPause = 0;

    protected execute(dt?: number, ...args: any[]): void {
        const playerEntiry = this.find(this.playerFilter);
        if (!playerEntiry) return;

        this.shootPause -= dt;
        if (this.shootPause > 0) return;

        const player = playerEntiry.get(PlayerComponent);
        this.shootPause = player.attackInterval;

        // 发射射击事件
        app.controller.game.shoot(player);
    }
}


