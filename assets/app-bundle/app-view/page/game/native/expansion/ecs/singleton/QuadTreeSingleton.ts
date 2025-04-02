import { ecsclass, EcsSingleton, IEntity } from 'db://assets/pkg-export/@gamex/cc-ecs';
import { QuadTree } from 'db://assets/pkg-export/@gamex/cc-quadtree';
import { MyEntity } from '../entity/MyEntity';
import { view } from 'cc';
import { QuadTreeBodyComponent } from '../component/QuadTreeBodyComponent';

@ecsclass('QuadTreeSingleton')
export class QuadTreeSingleton extends EcsSingleton {
    private _quadTree: QuadTree<MyEntity>;

    getQuadTree() {
        return this._quadTree;
    }

    init() {
        const winSize = view.getVisibleSize();
        this._quadTree = new QuadTree<MyEntity>(0, 0, winSize.width, winSize.height);
    }

    clear() {
        this._quadTree.clear();
        this._quadTree = null;
    }

    insert(entity: IEntity) {
        this._quadTree.insert(entity.get(QuadTreeBodyComponent).body);
    }

    remove(entity: IEntity) {
        this._quadTree.remove(entity.get(QuadTreeBodyComponent).body);
    }

    retrieve(entity: IEntity) {
        return this._quadTree.retrieve(entity.get(QuadTreeBodyComponent).body);
    }

    retrieveById(id: number) {
        return this._quadTree.retrieve(id);
    }

}


