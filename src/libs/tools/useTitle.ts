/**
 * @file the title of document
 */
import { useEffect } from 'react';

function useTitle(title: string): void {
  useEffect(() => {
    document.title = title;
  }, [title]);
}

export default useTitle;
