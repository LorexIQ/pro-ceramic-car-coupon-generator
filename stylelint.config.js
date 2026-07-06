export default {
  extends: ['stylelint-config-standard', 'stylelint-config-standard-vue', 'stylelint-config-recess-order'],
  plugins: ['stylelint-order'],
  overrides: [
    {
      files: ['*.vue', '**/*.vue'],
      customSyntax: 'postcss-html',
    },
  ],
  rules: {
    'at-rule-no-deprecated': [true, { severity: 'warning' }],
    'declaration-property-value-keyword-no-deprecated': [true, { severity: 'warning' }],
    'declaration-block-no-duplicate-properties': [true, { ignoreProperties: ['composes'] }],
    'custom-property-pattern': null,
    'shorthand-property-no-redundant-values': [true, { severity: 'warning' }],
    'declaration-block-no-redundant-longhand-properties': [true, { severity: 'warning' }],
    'selector-class-pattern': null,
    'value-keyword-case': ['lower', { ignoreProperties: ['composes'] }],
    'max-nesting-depth': 0,
    'function-url-scheme-disallowed-list': ['/^data/', { message: "Don't use data:image." }],
    'media-feature-range-notation': 'prefix',
    'declaration-empty-line-before': null,
  },
  ignoreFiles: ['dist/**'],
};
