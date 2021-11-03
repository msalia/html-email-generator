import pretty from "pretty";
import cheerio from "cheerio";
import fs from "fs";
import yargs from "yargs";

const RESET_CSS = ".html-body{background-color:#fff;font-family:sans-serif;-webkit-font-smoothing:antialiased;font-size:14px;line-height:1.4;margin:0;padding:0;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%}table{border-collapse:separate;mso-table-lspace:0;mso-table-rspace:0;width:100%}table td{font-family:sans-serif;font-size:14px;vertical-align:top}.body{background-color:#fff;width:100%}.container{display:block;margin:0 auto!important;max-width:800px;padding:10px;width:800px}.content{box-sizing:border-box;display:block;margin:0 auto;padding:10px}.main{background:#fff;border-radius:3px;width:100%}.wrapper{box-sizing:border-box;padding:0}.content-block{padding-bottom:10px;padding-top:10px}.footer{clear:both;margin-top:10px;text-align:center;width:100%}.footer a,.footer p,.footer span,.footer td{color:#999;font-size:12px;text-align:center}.h1,.h2,.h3,.h4{color:#000;font-family:Alice;font-weight:400;line-height:1.4;margin:0;margin-bottom:30px}.h1{font-size:35px;font-weight:300;text-transform:capitalize}.ol,.p,.ul{font-family:Lora;font-size:14px;font-weight:400;margin:0;margin-bottom:15px}.ol li,.p li,.ul li{list-style-position:inside;margin-left:5px}.a{display:block;color:rgba(0,0,0,.84);font-family:Roboto;font-size:14px;text-decoration:none}.a:hover{text-decoration:underline}.p:last-child{margin:0}.last{margin-bottom:0}.first{margin-top:0}.align-center{text-align:center}.align-right{text-align:right}.align-left{text-align:left}.align-justify{text-align:justify}.clear{clear:both}.mt0{margin-top:0}.mb0{margin-bottom:0}.preheader{color:transparent;display:none;height:0;max-height:0;max-width:0;opacity:0;overflow:hidden;mso-hide:all;visibility:hidden;width:0}.powered-by a{text-decoration:none}hr{border:0;border-bottom:1px solid #f6f6f6;margin:20px 0}.wide{display:block}.tall{display:none}@media only screen and (max-width:800px){table[class=body] .h1{font-size:28px!important;margin-bottom:10px!important}table[class=body] .a,table[class=body] .ol,table[class=body] .p,table[class=body] .span,table[class=body] .td,table[class=body] .ul{font-size:16px!important}table[class=body] .article,table[class=body] .wrapper{padding:0!important}table[class=body] .content{padding:0!important}table[class=body] .container{padding:0!important;width:100%!important}table[class=body] .main{border-left-width:0!important;border-radius:0!important;border-right-width:0!important}table[class=body] .btn table{width:100%!important}table[class=body] .btn a{width:100%!important}table[class=body] .img-responsive{height:auto!important;max-width:100%!important;width:auto!important}.header-title{font-size:30px!important;line-height:34px!important}.header-subtitle{font-size:18px!important;line-height:22px!important}table[class=body] .p.icon-image-title{font-size:20px!important}}@media only screen and (max-width:600px){.wide{display:none!important}.tall{display:block!important}}@media all{.ExternalClass{width:100%}.ExternalClass,.ExternalClass div,.ExternalClass font,.ExternalClass p,.ExternalClass span,.ExternalClass td{line-height:100%}.apple-link a{color:inherit!important;font-family:inherit!important;font-size:inherit!important;font-weight:inherit!important;line-height:inherit!important;text-decoration:none!important}#MessageViewBody a{color:inherit;text-decoration:none;font-size:inherit;font-family:inherit;font-weight:inherit;line-height:inherit}.btn-primary table td:hover{background-color:#34495e!important}.btn-primary a:hover{background-color:#34495e!important;border-color:#34495e!important}}";
const STYLES = ".p,li{font-family:Lora;font-size:18px;line-height:24px}.carousel-image,.divider,.half-image,.icon-image,.image,.simple-image{border-radius:10px;display:block;overflow:hidden;margin-bottom:24px;border:none;-ms-interpolation-mode:bicubic;max-width:100%}.icon-image{display:inline-block;height:50px!important;width:50px!important;margin-right:12px}.icon-image-title{font-weight:700;font-size:24px}.carousel-image,.image{width:100%}.divider{margin:24px auto 0}.half-image,.half-text{width:376px}.carousel-image{margin:0}.carousel-image-wrapper{margin:12px 0}.carousel{background-color:#ecf0f1;border-radius:10px}.header{margin:20px 0 12px}.section-header{color:rgba(0,0,0,.84);font-family:Roboto;border-bottom:1px solid rgba(0,0,0,.1);font-size:14px;padding:8px 0}.read-marker{color:rgba(0,0,0,.54);font-family:Roboto;font-size:14px;text-align:right}.header-title{display:block;font-family:Alice;font-size:40px;line-height:44px;margin:0}.header-subtitle{color:rgba(0,0,0,.54);display:block;font-family:Roboto;font-size:20px;font-weight:400;line-height:24px}.quote-spacing{box-sizing:border-box;border-left:4px solid #1abc9c;margin:30px 24px 0;padding-left:20px}.quote{box-sizing:border-box;font-family:Merienda;font-size:24px;line-height:28px}.half-spacing-bottom{margin-bottom:12px}.half-spacing-top{margin-top:12px}.spacing-top{margin-top:24px}.no-spacing-top{margin-top:0}.no-spacing-bottom{margin-bottom:0}.no-margin{margin:0}.spacing-right{margin-right:24px}.footer{margin-top:24px}.border-top,.footer,.inline-divider-top{border-top:1px solid rgba(0,0,0,.1)}.highlight-card{border-radius:10px;overflow:hidden;background-color:#1abc9c;color:#ffffff !important;padding:4px 12px}.card-title{font-family:Roboto;font-size:12px;font-weight:700;margin-bottom:8px}.input{position:absolute;display:none!important;visibility:hidden!important}.picker-pill{background-color:#bdc3c7;border-radius:6px;padding:6px;display:inline-block;margin:4px}.hero-link{display:inline-block;background-color:#3498db;border-radius:4px;box-sizing:border-box;padding:12px;text-decoration:none;color:#fff;font-weight:700;width:100%}.two-col-table-image-cell{width:40%}.two-col-table-text-cell{width:60%}.inline-divider-top{padding-top:24px}.highlight-title{background-color:#fff1cc;border-radius:8px;box-sizing:border-box;padding:8px 12px;width:100%}.profile td{vertical-align:middle}.mugshot{height:100px;margin:0;width:100px}.text-img-title{color:#778899;font-family:Roboto;font-size:14px;font-weight:700}.text-section-header{border-bottom:1px solid #d3d3d3;width:100%}";

// Setup command line argument parsing
const argv = yargs(process.argv)
	.option('template', {
		alias: 't',
		default: 'template.json',
		description: 'the template to use to generate html',
		type: 'string',
	})
	.option('filename', {
		alias: 'f',
		default: 'index.html',
		description: 'Name of output file',
		type: 'string',
	})
	.check(function (argv) {
  	if (!validTemplate(argv.template)) {
			throw new Error('Argument check failed: "' + argv.template + '" is not a valid template');
	 	}
		if (!validFilename(argv.filename)) {
			throw new Error('Argument check failed: "' + argv.filename + '" must end with .html');
		}
	 	return true;
  })
	.help()
	.alias('help', 'h')
	.argv;

function validFilename(filename) {
	try {
		return /\.html$/.test(filename);
	} catch (e) {
		return false;
	}
}

function validTemplate(filename) {
	const templateData = fs.readFileSync(
		filename,
		{encoding:'utf8', flag:'r'},
	);
	if (templateData == null) {
		throw new Error();
	}
	// Verify valid JSON, this will throw if invalid
	const data = JSON.parse(templateData);
	if (data.defaultMessage == null || data.title == null || data.subtitle == null || data.headerImage == null || data.content.length === 0) {
		throw new Error('Invalid "title", "subtitle", "headerImage", or "content"');
	}
	const content = data.content;
	for(const [index, item] of content.entries()) {
		switch (item.type) {
			case "content": {
				if (item.title == null || item.text.length === 0) {
					throw new Error('Invalid content block at index ' + index);
				}
				break;
			}
			case "divider": {
				break;
			}
			case "highlight-card": {
				if (item.title == null || item.sections.length === 0) {
					throw new Error('Invalid highlight-card block at index ' + index);
				}
				for(const [sectionIndex, section] of item.sections.entries()) {
					if (section.title == null || section.content == null) {
						throw new Error('Invalid highlight-card section index ' + sectionIndex + ' at block index ' + index);
					}
				}
				break;
			}
		}
	}
	return true;
}

const templateData = JSON.parse(fs.readFileSync(
	argv.template,
	{encoding:'utf8', flag:'r'},
));

const $ = cheerio.load("");
$("head").append('<meta name="viewport" content="width=device-width" />');
$("head").append('<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />');
$("head").append('<link href="https://fonts.googleapis.com/css2?family=Alice&family=Lora:ital@0;1&family=Merienda&family=Roboto:wght@300;400;500&display=swap" rel="stylesheet">');
$("head").append('<title>Nilkanth</title>');
$("head").append("<style>" + RESET_CSS + "</style>");
$("head").append("<style>" + STYLES + "</style>");
$("body").addClass("html-body");
$("body").append('<span class="preheader">' + templateData.defaultMessage + '</span>');

function getPropsText(props) {
	return Object.keys(props).map(key => `${key}="${props[key]}"`).join(' ');
}

function tag(tagName, props, ...children) {
	return '<' + tagName + ' ' + getPropsText(props) + '>' + children.join('') + '</' + tagName + '>';
}

function b(props, ...children) {
	return tag('b', props, ...children);
}

function table(props, ...children) {
	return tag('table', {
		role: 'presentation',
		border: 0,
		cellpadding: 0,
		cellspacing: 0,
		...props,
	}, ...children);
}

function tr(props, ...children) {
	return tag('tr', props, ...children);
}

function td(props, ...children) {
	return tag('td', props, ...children);
}

function div(props, ...children) {
	return tag('div', props, ...children);
}

function p(props, ...children) {
	return tag('p', props, ...children);
}

function img(props, src) {
	return '<img ' + getPropsText(props) + ' src="' + src + '"/>';
}

function header(template) {
	return [
		tr(
			{},
			td(
				{class: "section-header"},
				table({}, 
					tr(
						{},
						td(
							{},
							template.title,
						),
						td(
							{class: "read-marker"},
							template.subtitle,
						)
					)
				)
			)
		),
		tr(
			{},
			td(
				{},
				img(
					{class: "image spacing-top"},
					"https://baps.box.com/shared/static/ssk1ik5vwgzj81fp2ba94go4uaecqavn.jpg",
				)
			)
		)
	];
}

function contentSection(template) {
	return [
		template.heroImageTop != null
			? tr(
				{},
				td(
					{},
					img(
						{class: "image spacing-top", style: "margin-bottom: 0"},
						template.heroImageTop,
					),
				),
			) : null,
		tr(
			{},
			td(
				{},
				div(
					{class: "header"},
					p(
						{class: "header-title"},
						template.title,
					),
				),
			),
		),
		template.heroImageBottom != null
			? tr(
				{},
				td(
					{},
					img(
						{class: "image spacing-bottom"},
						template.heroImageBottom,
					),
				),
			) : null,
		tr(
			{},
			td(
				{},
				...template.text.map(chunk => p({class: "p text"}, chunk)),
				template.source != null ? p({class: "p text"}, '&mdash; ' + template.source) : null,
				...(template.images != null ? template.images.map((image, index) => img(
					{
						class: "image spacing-top",
						style: index === template.images.length -1 ? "margin-bottom: 0px" : undefined,
					},
					image,
				)) : []),
			),
		),
	];
}

function highlightSection(template) {
	return [
		tr(
			{},
			td(
				{},
				div(
					{class: "highlight-card spacing-top"},
					table(
						{cellspacing: 12},
						tr(
							{},
							td({class: "card-title", style: "color: #fff;"}, template.title.toUpperCase()),
							...template.sections.map(section => tr(
								{},
								td(
									{},
									p(
										{class: "p", style: "margin-bottom: 0; color: #fff;"},
										b({}, section.title),
									),
									p({class: "p", style: "color: #fff;"}, section.content),
								)
							))
						),
					),
				),
			),
		),
	];
}

function sections(template) {
	const contents = [];
	let dividerIndex = 0;
	for (const [index, content] of template.content.entries()) {
		switch (content.type){
			case 'content': {
				contents.push(...contentSection(content));
				break;
			}
			case 'divider' :{
				contents.push(divider(dividerIndex++ % 2 === 0 ? true : false));
				break;
			}
			case 'highlight-card': {
				contents.push(...highlightSection(content));
				break;
			}
		}
	}
	return contents;
}

function divider(isOdd) {
	return tr(
		{},
		td(
			{},
			img(
				{class: "divider"},
				isOdd
					? "https://baps.box.com/shared/static/akhyu9y1nlu11g8kcmk5zhop7xllztqw.png"
					: "https://baps.box.com/shared/static/r4ldi7alt6a6jg2k39wc27muh9szjhje.png",
			),
		),
	);
}

function footer(template) {
	return [
		div(
			{class: "footer"},
			table(
				{},
				tr(
					{},
					td(
						{class: "content-block"},
						img(
							{class: "image"},
							"https://baps.box.com/shared/static/isakjjkqfw87mqt5gptwr2grfbf6xhnx.png"
						),
					),
				),
			),
		),
	];
}

function createLayout(template) {
	const spacer = td({style: "width: 16px;"}, '&nbsp;');
	return $(table(
		{class: "body"},
		tr(
			'',
			spacer,
			td(
				{class: "container"},
				div(
					{class: "content"},
					table(
						{class: "main"}, 
						...header(template),
						...sections(template),
					),
					...footer(template),
				),
			),
			spacer,
		)
	));
}

// Create html from template
const layout = createLayout(templateData);
$("body").append(layout);

// Write template to HTML file
fs.writeFile(
	argv.filename,
	pretty($.html()),
	function (err) {
		if (err) return console.log(err);
		console.log('Wrote ' + argv.filename);
	},
);