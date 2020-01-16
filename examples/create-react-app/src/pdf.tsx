import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

import pdfjs from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry';

pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

const PdfComponent = ({ src }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    let loadingTask;
    const fetchPdf = async () => {
      loadingTask = pdfjs.getDocument(src);
    
      const pdf = await loadingTask.promise;

      const firstPageNumber = 1;

      const page = await pdf.getPage(firstPageNumber);

      const scale = 1.5;
      const viewport = page.getViewport({scale: scale});

      // Prepare canvas using PDF page dimensions
      const canvas = canvasRef.current;

      const context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      // Render PDF page into canvas context
      const renderContext = {
        canvasContext: context,
        viewport: viewport
      };
      const renderTask = page.render(renderContext);

      await renderTask.promise;
    };

    fetchPdf();
    
    // Ensures that we destroy the worker when the component unmounts.
    return () => {
        loadingTask.destroy();
    }
  }, [src]);

  return (
    <canvas
      ref={canvasRef}
      width={window.innerWidth}
      height={window.innerHeight}
    />
  );
}

PdfComponent.propTypes = {
  src: PropTypes.string
};

PdfComponent.defaultProps = {
  src: `${process.env.PUBLIC_URL}/helloworld.pdf`
};

export default PdfComponent;
