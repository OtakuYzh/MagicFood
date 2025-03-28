import { ecsclass, EcsComponent } from 'db://assets/pkg-export/@gamex/cc-ecs';
import { MyEntity } from '../entity/MyEntity';

@ecsclass('BulletComponent')
export class BulletComponent extends EcsComponent<MyEntity> {
    static allowRecycling: boolean = true;
}


