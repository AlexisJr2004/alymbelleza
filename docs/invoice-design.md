# Factura Bella Beauty

El documento de compra sigue la referencia negra y dorada: fotografía cosmética, cabecera curva, tarjetas de cliente, tabla numerada, total destacado y pie de agradecimiento. La plantilla está en `frontend/public-app/src/lib/invoiceTemplate.ts`.

Los importes, descuentos, fecha e identificador proceden del pedido. La referencia corta corresponde a sus últimos diez caracteres; no es una numeración fiscal. La dirección se toma del perfil cuando está disponible y, si falta, se muestra «Entrega por coordinar». El WhatsApp es el mismo de la página Pagos. No se copian datos personales, numeraciones ni redes sociales de la imagen de ejemplo.

La exportación mantiene un ancho de 718 px para A4 incluso en móvil, espera la carga de sus imágenes y evita dividir filas, cabecera y pie. Conserva el aviso de pago por verificar y la naturaleza del documento de pedido.

## Fotografía decorativa

Archivo: `frontend/public-app/src/assets/invoice/cosmetics-gold.png`.

Generada con la habilidad `imagegen` y la herramienta integrada `image_gen`; sin CLI ni API alternativa. El logotipo y los iconos son SVG derivados del sistema visual del proyecto. La fotografía se incluye en los archivos de producción y no depende de servicios externos.

Prompt final:

> Create a photorealistic luxury cosmetics still life for the decorative right half of an invoice header. Wide landscape 3:2 composition, white ivory satin with gentle folds, a white cream jar with polished gold lid tilted behind, two clear glass serum dropper bottles containing pale gold and blush liquid with shiny gold collars, a white orchid flower beside the cream. Objects arranged on the right two thirds, empty bright ivory silk on left third. Elegant commercial product photography, soft light, neutral white and gold palette, no pink background. NO text, NO labels, NO logos, NO watermark, NO invoice UI. Output one image.
