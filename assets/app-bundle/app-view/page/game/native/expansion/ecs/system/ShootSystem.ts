import { EcsSystem, filter, NodeComponent } from "db://assets/pkg-export/@gamex/cc-ecs";
import { PlayerComponent } from "../component/PlayerComponent";
import { app } from "db://assets/app/app";
import { QuadTreeSingleton } from "../singleton/QuadTreeSingleton";
import { RangeComponent } from "../component/RangeComponent";
import { QuadTreeBodyComponent } from "../component/QuadTreeBodyComponent";
import { Vec2 } from "cc";

/**
 * 射击系统
 * 玩家组件
 */
export class ShootSystem extends EcsSystem {
    private playerFilter = filter.all(PlayerComponent);
    private rangeFilter = filter.all(RangeComponent, QuadTreeBodyComponent);

    private shootPause = 0;

    protected execute(dt?: number, ...args: any[]): void {
        const playerEntiry = this.find(this.playerFilter);
        if (!playerEntiry) return;

        this.shootPause -= dt;

        const player = playerEntiry.get(PlayerComponent);

        if (this.shootPause > 0) return;

        let targetX = 0;
        let targetY = 0;
        const quadTreeSingleton = this.ecs.getSingleton(QuadTreeSingleton);
        const rangeEntity = this.find(this.rangeFilter);
        const bodyList = quadTreeSingleton.retrieveById(rangeEntity.get(QuadTreeBodyComponent).body.id);
        let minDistance = 0;
        const playerPosX = playerEntiry.get(NodeComponent).x;
        const playerPosY = playerEntiry.get(NodeComponent).y;
        for (const body of bodyList) {
            const distance = Vec2.distance({ x: body.xMid, y: body.xMid }, { x: playerPosX, y: playerPosY });
            if (distance < minDistance || minDistance == 0) {
                minDistance = distance;
                targetX = body.xMid;
                targetY = body.yMid;
            }
        }

        if (targetX == 0 && targetY == 0) return;

        this.shootPause = player.attackInterval;

        // 发射射击事件
        app.controller.game.shoot(player, targetX, targetY);
    }
}


