import { app } from 'db://assets/app/app';
import { EcsSystem } from 'db://assets/pkg-export/@gamex/cc-ecs';

export class EnemySystem extends EcsSystem {

    private interval = 0;

    protected execute(dt?: number, ...args: any[]): void {
        this.interval -= dt;
        if (this.interval > 0) return;
        this.interval = 2;

        app.controller.game.enemy();
    }
}


