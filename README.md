## Available Scripts

In the project directory, you can run:

### `yarn build`

Generates the index.html file given templat.json

### `yarn build --template=template.json --filename=index.html`

`--template` option allows you to pass in the name of the template to use.
`--filename` option allows you to pass in the name for the output html file.

You should create a new `template-MON-YEAR.json` file for every publication.
You should creatte a new `index-MON-YEAR.html` file for every publication.
Save all templates and generated files for archival purpose. 

For example, October 2021 publication:
1. Create a new template: `template-OCT-2021.json` and populate with content.
2. Generate `index-OCT-2021.html` by running the following command:
`yarn build --template=template-OCT-2021.json --filename=index-OCT-2021.html`
