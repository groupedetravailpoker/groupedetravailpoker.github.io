
var image_sizes = '100%';
var image_max_size = '800px';
var button_style = 'btn-outline-secondary';

d3.json("./ryeweb/ranges_rye_3.json", function(error, data) {
    console.log('data', data);

    tabs_ = d3.map(data, function(d){return d.action;}).keys();
    console.log(tabs_);
    var tabs = ["OR","OR-SB","BB-defense","Push", "Flat3bet"];
    // tabs = tabs_;
    nav_ul = d3.select('body').append('ul').attr('class',"nav nav-tabs").attr('role', 'tablist');
    nav_ul.selectAll('.nav-item')
	.data(tabs)
	.enter().append('li')
	.attr('class', "nav-item")
	.append('a')
	.attr('class','nav-link')
	.attr('data-toggle',"tab")
	.attr('href', function(d) { return '#'+d; })
	.attr('role',"tab")
	.attr('aria-controls', function(d) { return '#'+d; })
	.attr('aria-selected',"true")
	.html(function(d) { return d; });

    or = data.filter(function(d){return d.action == 'OR'});
    //console.log(or);
    bbs = d3.map(or, function(d){return d.stack;}).keys();
    //console.log(bbs);

    
    div_tabs = d3.select('body').append('div').attr('class',"tab-content mt-3");

    // main tabls : main ACTIONS as OR, etc.
    div_tabs.selectAll(".tab-pane").data(tabs).enter()
	.append('div')
	.attr('class',"tab-pane")
	.attr('id',function(d) { return d; })
	.attr('aria-labelledby', function(d) { return d + '-tab';})
	.attr('role',"tabpanel")
    ;
    
    // for each panel (action), make the sub group by stack
    div_buts = div_tabs.selectAll('.tab-pane')
	.append('div')
	.attr('id', function(d){ return 'div-but-' + d})
	.attr('class', 'div-but');

    tabs2 = div_buts.append('ul').attr('class',"nav nav-tabs").attr('role', 'tablist')
	.selectAll('.nav-item')
	.data(function(d){return get_stacks_divs(data,d);})
	.enter()
	.append('li')
	.attr('class', "nav-item")
	.append('a')
	.attr('class','nav-link')
	.attr('data-toggle',"tab")
	.attr('href', function(d) { return '#' + 'div_stack-tab-' + d.action + '-' + d.stack; })
	.attr('role',"tab")
	.attr('aria-controls', function(d) { return '#' + d; })
	.attr('aria-selected',"true")
	.html(function(d) { return d.stack; });

    tab_cont2 = div_buts.append('div').attr('class',"tab-content mt-3");

    tab_stacks = tab_cont2.selectAll('.tab-pane')
	.data(function(d){return get_stacks_divs(data,d);})
        .enter()
        .append('div')
        .attr('class', ' tab-pane')
    //.html(function(d){return '<h3>' + d.stack + '</h3>';})
	.attr('id', function(d){return  'div_stack-tab-' + d.action + '-' + d.stack})
	.attr('role',"tabpanel")
    
    tab_stacks.selectAll('.btn')
	.data(function(d){return get_data_buttons(data,d);})
        .enter()
	.append('button')
	.attr('class',get_button_style)
	.attr('type', 'button')
        .html(function(d){
	    //console.log(d);
	    return get_html_buttons(d);})
	.on('click', function(d) {
	    display_image(d);
	});
    
    div_tabs.selectAll('.tab-pane').append('div').attr('class', 'div-imgs')
	.selectAll('.imm')
	.data(function(d){return data.filter(function(s){return s.action == d})})
	.enter()
	.append('img')
	.attr('class', 'imm')
	.attr('src', function(s){return s.filename;})
	.attr('width', image_sizes)
        .style('max-width', image_max_size)
	.attr('stack', function(s){return s.stack;})
	.attr('hero', function(s){return s.hero;})
	.attr('vil', function(s){return s.vil;})
    //.attr('dummy', function(s){//console.log(s);})
	.style('display','none')
    ;


})

//// FUNCTIONS ///////////////////////////////

function get_stacks(dat,action){
    lst = dat.filter(function(s){return s.action == action});
    fn = d3.map(lst, function(d){return d.stack;}).keys();
    return fn;
}

function get_stacks_divs(dat,action){
    lst = dat.filter(function(s){return s.action == action});
    fn = d3.map(lst, function(d){return d.stack;}).keys();
    res = []
    fn.forEach(function(d){
	dd = {stack: d, action: action};
	res.push(dd)
	
    })
    console.log(fn, action, res);
    return res;
}


function get_labels_by_stack(dat,action,stack){
    lst = dat.filter(function(s){return s.action == action & s.stack == stack});
    fn = d3.map(lst, function(d){return d.label;}).keys();
    console.log(action, stack, lst, fn);
    return fn;
}

function display_image(d){
    console.log(d);
    tab = d3.select('#' + d.action);
    images = tab.selectAll('.imm').
	filter(function(s) {
	    
	    //console.log(d, d.stack == stack & d.hero.includes(hero));
	    //res1 = s.stack == d.stack & s.hero.includes(d.hero)
	    //res2 = s.hero.includes(d.hero)
	    //res = d.stack = "" ? res2 : res1
	    console.log(s.stack, d.stack, s.hero, d.hero)
	    return s.stack == d.stack & s.label == d.label;
	});
    tab.selectAll('.imm').style('display','none')
    console.log('images')
    console.log(images)
    images.style('display', 'inline-flex')
    return images;
}

function get_order(hero,vil){
    o1 = 0;
    if(hero.includes('SB')) o1 = 10;
    if(hero.includes('BB')) o1 = 20;
    if(hero.includes('UTG')) o1 = 30;
    if(hero.includes('UTG1')) o1 = 33;
    if(hero.includes('UTG2')) o1 = 36;
    if(hero.includes('MP')) o1 = 40;
    if(hero.includes('HJ')) o1 = 50;
    if(hero.includes('CO')) o1 = 60;
    if(hero.includes('BU')) o1 = 70;
    if(hero.includes('BTN')) o1 = 70;

    o2 = 0;
    
    if(vil.includes('SB')) o2 = 1;
    if(vil.includes('BB')) o2 = 2;
    if(vil.includes('UTG')) o2 = 3;
    if(vil.includes('UTG1')) o2 = 3.3;
    if(vil.includes('UTG2')) o2 = 3.6;
    if(vil.includes('MP')) o2 = 4;
    if(vil.includes('HJ')) o2 = 5;
    if(vil.includes('CO')) o2 = 6;
    if(vil.includes('BU')) o2 = 7;
    if(vil.includes('BTN')) o2 = 7;
    

    console.log('order', hero, vil, o1 + o2);
    return(o1 + 02)
}




function get_data_buttons(data,d){
    //console.log('buttons', d);
    var dd = data.filter(function(s){return s.action == d.action & s.stack == d.stack;});
    dd.forEach(function(d){
	d.order = get_order(d.hero,d.vil);
    })
    dd = dd.sort(function(x,y){
	return d3.descending(x.order, y.order);
    })
    console.log('buttons');
    console.log(dd);
    return(dd);
}

function get_data_buttons_bkup(data,d){
    //console.log('buttons', d);
    var dd = data.filter(function(s){return s.action == d;});
    var stacks = get_stacks(data,d);
    var heros = get_heros(data,d);
    var dbut = [];
    stacks.forEach(function(st){
	heros.forEach(function(her){
	    dbut.push({stack: st, hero: her, action: d})
	})
    })
    //console.log(dbut);
    return dbut
}

function get_html_buttons(d){
    //var html = d.stack + ' - ' + d.hero
    var html = d.label;
    if(d.vil == "") html = d.hero;
    return html;
}

function get_button_style(d){
    //console.log('style', d);
    var sty = 'btn btn-sm btn-';
    var sty2 = 'primary'
    if(d.hero.includes('UTG')) sty2 = 'dark';
    if(d.hero.includes('SB')) sty2 = 'info';
    if(d.hero.includes('HJ') | d.hero.includes('MP')) sty2 = 'success';
    if(d.hero.includes('BB')) sty2 = 'danger';
    if(d.hero.includes('CO')) sty2 = 'warning';
    return sty + sty2;
}

