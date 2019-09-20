// Custom Acceptor
class QuerySelectorAcceptor extends dragndrop.dropzone.Acceptor {
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
const draggableA = dragndrop.draggable.Draggable.attachTo(document.querySelector('#draggable-a'), { avatar: new dragndrop.draggable.Avatar.clone()});
const draggableB = dragndrop.draggable.Draggable.attachTo(document.querySelector('#draggable-b'), { avatar: new dragndrop.draggable.Avatar.clone()});
const draggableC = dragndrop.draggable.Draggable.attachTo(document.querySelector('#draggable-c'), { avatar: new dragndrop.draggable.Avatar.clone()});

const dropzone1 = dragndrop.dropzone.Dropzone.attachTo(document.querySelector('#dropzone-1'));
const dropzone2 = dragndrop.dropzone.Dropzone.attachTo(document.querySelector('#dropzone-2'), {
    acceptor: new dragndrop.dropzone.DraggablesAcceptor([draggableB])
});

const dropzone3 = dragndrop.dropzone.Dropzone.attachTo(document.querySelector('#dropzone-3'), {
    acceptor: new QuerySelectorAcceptor('#draggable-c')
});