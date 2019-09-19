// Custom Acceptor
class QuerySelectorAcceptor extends dnd.dropzone.Acceptor {
    querySelector;
    constructor(querySelector) {
        super();
        this.querySelector = querySelector;
    }

    accepts(dragInfo, dropzoneElement, event) {
        const element = document.querySelector(this.querySelector);
        return element === dragInfo.element;
    }
}

// Install draggables.
const draggableA = dnd.draggable.Draggable.attachTo(document.querySelector('#draggable-a'), { avatar: new dnd.draggable.Avatar.clone()});
const draggableB = dnd.draggable.Draggable.attachTo(document.querySelector('#draggable-b'), { avatar: new dnd.draggable.Avatar.clone()});
const draggableC = dnd.draggable.Draggable.attachTo(document.querySelector('#draggable-c'), { avatar: new dnd.draggable.Avatar.clone()});

const dropzone1 = dnd.dropzone.Dropzone.attachTo(document.querySelector('#dropzone-1'));
const dropzone2 = dnd.dropzone.Dropzone.attachTo(document.querySelector('#dropzone-2'), {
    acceptor: new dnd.dropzone.DraggablesAcceptor([draggableB])
});

const dropzone3 = dnd.dropzone.Dropzone.attachTo(document.querySelector('#dropzone-3'), {
    acceptor: new QuerySelectorAcceptor('#draggable-c')
});