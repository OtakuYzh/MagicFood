import { ecsclass, EcsComponent } from 'db://assets/pkg-export/@gamex/cc-ecs';
import { MyEntity } from '../entity/MyEntity';
import { Body } from 'db://pkg/@gamex/cc-sap';

@ecsclass('CollisionComponent')
export class CollisionComponent extends EcsComponent<MyEntity> {
    static allowRecycling: boolean = true;

    public body = new Body<MyEntity>(0);

    protected onAdd(): void {
        this.body.setID(this.entity.uuid);
        this.body.setData(this.entity);
    }

    protected onRemove(): void {
        this.body.setID(0);
        this.body.setData(null);
    }
}


