import { useCallback } from 'react';
import useCreateContextMenu from './use-create-context-menu';

const useCreateContextMenuForTarget = (content) => {
  const createContextMenu = useCreateContextMenu();

  const createContextMenuForTarget = useCallback(
    (event) => {
      event.preventDefault();
      event.stopPropagation();
      const { x: viewportX, bottom } = event.target.getBoundingClientRect();
      const x = viewportX + window.scrollX;
      const y = bottom + window.scrollY;
      createContextMenu({ x, y, content });
    },
    [createContextMenu, content]
  );

  return createContextMenuForTarget;
};

export default useCreateContextMenuForTarget;
