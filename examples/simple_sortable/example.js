// Install same elements as draggable and dropzone.
document.querySelectorAll('.sortable').forEach((element) => {
    dnd.draggable.Draggable.attachTo(element, { avatar: new dnd.draggable.Avatar.clone()});

    dnd.dropzone.Dropzone.attachTo(element);

    element.addEventListener('onDrop', (event) => {
        const elm1 = event.detail.dropzoneElement;
        const elm2 = event.detail.dragInfo.element;

        const parent1 = elm1.parentNode;
        const next1 = elm1.nextElementSibling;
        const parent2 = elm2.parentNode;
        const next2 = elm2.nextElementSibling;

        parent1.insertBefore(elm2, next1);
        parent2.insertBefore(elm1, next2);
    });
});
