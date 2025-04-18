
import { template1 } from './pdf/templates/template1';
import { template2 } from './pdf/templates/template2';
import { template3 } from './pdf/templates/template3';

export const pdfTemplates = {
  template1,
  template2,
  template3,
};

export const defaultPdfTemplate = {
  html: pdfTemplates.template1
};

export { pdfUtils } from './pdf/utils/pdf-utils';
