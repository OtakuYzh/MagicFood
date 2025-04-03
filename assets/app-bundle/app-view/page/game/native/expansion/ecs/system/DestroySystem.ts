import { EcsSystem, filter, NodeComponent } from 'db://assets/pkg-export/@gamex/cc-ecs';
import { DestroyComponent } from '../component/DestroyComponent';
import { EnemyComponent } from '../component/EnemyComponent';
import { app } from 'db://assets/app/app';
import { BulletComponent } from '../component/BulletComponent';
import { ExpComponent } from '../component/ExpComponent';

export class DestroySystem extends EcsSystem {

    private destroyFilter = filter.all(DestroyComponent);

    protected afterExecute(dt?: number, ...args: any[]): void {
        this.query(this.destroyFilter).forEach(entity => {
            if (entity.has(EnemyComponent)) {
                app.controller.game.collectEnemy(entity.node);
            } else if (entity.has(BulletComponent)) {
                app.controller.game.collectBullet(entity.node);
            } else if (entity.has(ExpComponent)) {
                app.controller.game.collectExp(entity.node);
            } else {
                entity.node.destroy();
            }

            entity.destroy();
        })
    }
}


