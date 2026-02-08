import React from 'react';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

// --- 1. THE DRAGGABLE WRAPPER (For Cards in Hand) ---
export const DraggableCard = ({ id, children, disabled }) => {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: id,
        disabled: disabled, // We can disable dragging if it's not our turn
    });

    const style = {
        // This moves the card when you drag it
        transform: CSS.Translate.toString(transform),
        // If dragging, make it pop up and look transparent
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 999 : 1,
        cursor: disabled ? 'default' : 'grab',
        touchAction: 'none', // Crucial for mobile dragging
    };

    return (
        <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
            {children}
        </div>
    );
};

// --- 2. THE DROPPABLE WRAPPER (For Bank/Property Zones) ---
export const DroppableZone = ({ id, children, style }) => {
    const { setNodeRef, isOver } = useDroppable({
        id: id,
    });

    // Visual Feedback: Light up green when hovering
    const activeStyle = {
        ...style,
        backgroundColor: isOver ? 'rgba(72, 187, 120, 0.3)' : style.backgroundColor,
        border: isOver ? '2px dashed #48bb78' : style.border,
        transition: 'background-color 0.2s ease',
    };

    return (
        <div ref={setNodeRef} style={activeStyle}>
            {children}
        </div>
    );
};