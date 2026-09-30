// A syntax theme drawn from the Aurora palette. Light (mint, violet) marks the
// things you'd change; bone and stone carry the structure.
export const auroraTheme = {
  name: 'aurora',
  type: 'dark',
  colors: { 'editor.background': '#00000000', 'editor.foreground': '#C9C6BE' },
  tokenColors: [
    { scope: ['comment', 'punctuation.definition.comment'], settings: { foreground: '#86847D', fontStyle: 'italic' } },
    { scope: ['keyword', 'storage', 'storage.type', 'keyword.control', 'keyword.operator.new', 'keyword.operator.expression'], settings: { foreground: '#A78BE0' } },
    { scope: ['string', 'string.quoted', 'string.template', 'constant.other.color', 'constant.numeric', 'constant.language', 'keyword.other.unit'], settings: { foreground: '#7FD9C0' } },
    { scope: ['entity.name.tag', 'support.class.component', 'entity.name.type', 'entity.name.function', 'support.function', 'meta.function-call entity.name.function'], settings: { foreground: '#EDEBE5' } },
    { scope: ['entity.other.attribute-name', 'support.type.property-name', 'meta.object-literal.key', 'variable.other.property'], settings: { foreground: '#9C9A93' } },
    { scope: ['variable', 'variable.other', 'variable.parameter', 'meta.definition.variable'], settings: { foreground: '#C9C6BE' } },
    { scope: ['variable.css', 'variable.argument.css', 'support.type.custom-property', 'support.type.custom-property.name'], settings: { foreground: '#A78BE0' } },
    { scope: ['entity.other.attribute-name.class.css', 'entity.name.tag.css', 'entity.other.attribute-name.pseudo-class.css'], settings: { foreground: '#EDEBE5' } },
    { scope: ['punctuation', 'meta.brace', 'punctuation.definition.tag', 'punctuation.separator', 'punctuation.terminator', 'keyword.operator'], settings: { foreground: '#86847D' } },
    { scope: ['support.constant.property-value', 'support.constant'], settings: { foreground: '#C9C6BE' } },
  ],
};
