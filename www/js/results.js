var  DATA_NOT_FOUND_MESSAGE = 'N/A'

function load_views()
{
  dataSet = filterDataset();
  status_count = status_counter();
  severity_count = severity_counter();
  draw_data_table();
  update_banners();
  draw_status_pie_chart();
  draw_severity_pie_chart()
  draw_compliance_pie_chart();
  draw_tree_map();
  draw_ssp_table();
}

function details_panel ( d ) {
    // `d` is the original data object for the row
  var details_panel = '';
  details_panel +=
  '<ul class="nav nav-tabs">'+
  '<li class="active"><a data-toggle="tab" href="#fdetails">Finding Details</a></li>'+
  '<li><a data-toggle="tab" href="#details" >Details</a></li>'+
  '<li onclick = test()><a data-toggle="tab" href="#inpec_code" >Inspec Code</a></li>'+
  '</ul>'+
  '<div class="tab-content">'+
    '<div id="fdetails" class="tab-pane fade in active">'+
      '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">'+
        '<tr>'+
            '<td>'+d.finding_details.replace(/(?:\r\n|\r|\n)/g, '<br>')+'</td>'+
        '</tr>'+
    '</table>'+
    '</div>'+
    '<div id="details" class="tab-pane fade">'+
      '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">';


    //Mandatory feilds
    details_panel += '<tr>'+ '<td>Control:</td>'+ '<td>'+d['vuln_num']    +'</td>'+ '</tr>';
    details_panel += '<tr>'+ '<td>Title:</td>'  + '<td>'+d['rule_title']  +'</td>'+ '</tr>';
    details_panel += '<tr>'+ '<td>Desc:</td>'   + '<td>'+d['vuln_discuss']+'</td>'+ '</tr>';

    var  DATA_NOT_FOUND_MESSAGE = 'N/A'
    // Optional Tags
    if (d['severity']      != DATA_NOT_FOUND_MESSAGE) { details_panel += '<tr>'+ '<td>Severity:</td>'  + '<td>'+d['severity']     +'</td>'+ '</tr>'; }
    if (d['impact']        != DATA_NOT_FOUND_MESSAGE) { details_panel += '<tr>'+ '<td>Impact:</td>'    + '<td>'+d['impact']       +'</td>'+ '</tr>'; }
    if (d['nist']          != DATA_NOT_FOUND_MESSAGE) { details_panel += '<tr>'+ '<td>Nist Ref:</td>'  + '<td>'+d['nist']         +'</td>'+ '</tr>'; }
    if (d['rationale']     != DATA_NOT_FOUND_MESSAGE) { details_panel += '<tr>'+ '<td>Rationale:</td>' + '<td>'+d['rationale']    +'</td>'+ '</tr>'; }
    if (d['cis_family']    != DATA_NOT_FOUND_MESSAGE) { details_panel += '<tr>'+ '<td>CIS family:</td>'+ '<td>'+d['cis_family']   +'</td>'+ '</tr>'; }
    if (d['cis_rid']       != DATA_NOT_FOUND_MESSAGE) { details_panel += '<tr>'+ '<td>CIS rid:</td>'   + '<td>'+d['cis_rid']      +'</td>'+ '</tr>'; }
    if (d['cis_level']     != DATA_NOT_FOUND_MESSAGE) { details_panel += '<tr>'+ '<td>CIS level:</td>' + '<td>'+d['cis_level']    +'</td>'+ '</tr>'; }
    if (d['check_content'] != DATA_NOT_FOUND_MESSAGE) { details_panel += '<tr>'+ '<td>Check Text:</td>'+ '<td>'+d['check_content']+'</td>'+ '</tr>'; }
    if (d['fix_text']      != DATA_NOT_FOUND_MESSAGE) { details_panel += '<tr>'+ '<td>Fix Text:</td>'  + '<td>'+d['fix_text']     +'</td>'+ '</tr>'; }

    details_panel +=
    '</table>'+
    '</div>'+
    '<div id="inpec_code" class="tab-pane fade">'+
      '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">'+
        '<tr>'+
            '<td><pre><code class="ruby">'+d.code+'</code></pre></td>'+
        '</tr>'+
    '</table>'+
    '</div>';

    return details_panel;
}

function status_counter()
{
  var status_count = {}
  status_count ['not_a_finding_count']  = $(dataSet).filter(function (i,n){return n.result==='NotAFinding';}).length;
  status_count ['open_count']           = $(dataSet).filter(function (i,n){return n.result==='Open';}).length;
  status_count ['not_applicable_count'] = $(dataSet).filter(function (i,n){return n.result==='Not_Applicable';}).length;
  status_count ['not_reviewed_count']   = $(dataSet).filter(function (i,n){return n.result==='Not_Reviewed';}).length;
  status_count ['not_tested_count']     = $(dataSet).filter(function (i,n){return n.result==='Not_Tested';}).length;
  return status_count
}

function severity_counter()
{
  var severity_count = {}
  severity_count['CAT I'  ] = $(dataSet).filter(function (i,n){return n.severity==='high';}).length;
  severity_count['CAT II' ] = $(dataSet).filter(function (i,n){return n.severity==='medium';}).length;
  severity_count['CAT III'] = $(dataSet).filter(function (i,n){return n.severity==='low';}).length;
  return severity_count
}

function draw_data_table()
{
  dataSet = filterDataset();
  if ( $.fn.dataTable.isDataTable( '#results_table' ) )
  {
  var datatable = $('#results_table').dataTable().api();
  datatable.clear();
  datatable.rows.add(dataSet);
  datatable.draw();
  }
  else
  {
      // use dataSet to filter and group controls
    var table = $('#results_table').DataTable( {
         "iDisplayLength": 5,

  "rowCallback": function( row, data, index ) {
    if ( data.result == "NotAFinding" ) {
      $('td:eq(0)', row).html( '<button class="btn btn-success" style="width:120px" >NotAFinding</button> ' );
    }
    if ( data.result == "Open" ) {
      $('td:eq(0)', row).html( '<button class="btn btn-danger" style="width:120px">Open</button> ' );
    }
    if ( data.result ==  "Not_Applicable") {
      $('td:eq(0)', row).html( '<button class="btn btn-info" style="width:120px">Not_Applicable</button> ' );
    }
    if ( data.result == "Not_Reviewed" ) {
      $('td:eq(0)', row).html( '<button class="btn btn-warning" style="width:120px">Not_Reviewed</button> ' );
    }
    if ( data.result == "Not_Tested" ) {
      $('td:eq(0)', row).html( '<button class="btn btn-warning" style="width:120px">Not_Tested</button> ' );
    }

  },
        data: dataSet,
        "columns": [
            {
              "className":      'table_row',
              "orderable":      true,
              "data":           "result",
              "defaultContent": ''
            },
            {
              // "className": 'table_row',
              "data": "vuln_num"
            },
            {
              // "className": 'table_row',
              "data": "severity"
            },
            {
              // "className": 'table_row',
              "data": "nist"
            },
            {
              "className": 'hidden_column',
              "data": "code"
            }
        ],
        "order": [[1, 'asc']]
    } );
        // Add event listener for opening and closing details
    $('#results_table tbody').on('click', 'td.table_row',
      function ()
      {
        var tr = $(this).closest('tr');
        var row = table.row( tr );

        if ( row.child.isShown() )
        {
          row.child.hide();
          tr.removeClass('shown');
        }
        else
        {
         if ( table.row( '.shown' ).length )
         {
            $('.table_row', table.row( '.shown' ).node()).click();
         }
         row.child( details_panel(row.data()) ).show();
         tr.addClass('shown');
        }
      });
  }
}

function update_banners()
{
  document.getElementById("not_a_finding").innerHTML  = status_count['not_a_finding_count'];
  document.getElementById("open").innerHTML           = status_count['open_count'];
  document.getElementById("not_applicable").innerHTML = status_count['not_applicable_count'];
  document.getElementById("not_reviewed").innerHTML   = status_count['not_reviewed_count'];
}


function draw_status_pie_chart()
{

  status_data = [
                ['Not A Finding',  status_count['not_a_finding_count']],
                ['Open',           status_count['open_count']],
                ['Not Applicable', status_count['not_applicable_count']],
                ['Not Reviewed',   status_count['not_reviewed_count']]
                ];

  c3.generate(
  {
    bindto: '#status_pie',
    data: {
        columns: status_data,
        type : 'donut',
        onclick: function (d) {
          document.getElementById("clear_filters_button").style.visibility = "visible";
          if (d.id == 'Not A Finding'){
            data_filter.result = 'NotAFinding';
          }else if (d.id == 'Open'){
            data_filter.result = 'Open';
          }else if (d.id == 'Not Applicable'){
            data_filter.result = 'Not_Applicable';
          }else if (d.id == 'Not Reviewed'){
            data_filter.result = 'Not_Reviewed';
          }
          load_views();
        },
    },
    color:
    {
      pattern: ['rgb(137, 204, 81)', 'rgb(255, 0, 41)', 'rgb(0, 200, 241)', 'rgb(255, 200, 87)']
    },
    size:
    {
      height: 240
    },
    donut:
    {
      title: "Control Status",
      label:
      {
        format: function (value, ratio, id)
        {
          return d3.format()(value);
        }
    }
      }
  });
}

function draw_severity_pie_chart()
{
  severity_data = [
            ['CAT I',   severity_count['CAT I']],
            ['CAT II',  severity_count['CAT II']],
            ['CAT III', severity_count['CAT III']],
        ];

  c3.generate(
  {
    bindto: '#severity_pie',

    data:
    {
      columns: severity_data,
      type : 'donut',
      onclick: function (d)
      {
        document.getElementById("clear_filters_button").style.visibility = "visible";
        if (d.id == 'CAT I'){
          data_filter.severity = 'high';
        }else if (d.id == 'CAT II'){
          data_filter.severity = 'medium';
        }else if (d.id == 'CAT III'){
          data_filter.severity = 'low';
        }
        load_views();
      },
    },
    color:
    {
        pattern: ['rgb(255, 0, 41)','rgb(255, 200, 87)','rgb(137, 204, 81)' ]
    },
    size:
    {
      height: 240
    },
    donut:
    {
      title: "Control Severity",
      label:
      {
        format: function (value, ratio, id)
        {
          return d3.format()(value);
        }
      }
    }
  });
}

function score ()
{
  return ((status_count['not_a_finding_count'] + status_count['not_applicable_count'])/dataSet.length)*100;
}

function draw_compliance_pie_chart()
{
  compliance_data = [
                ['data', score ()]
                ];
  c3.generate({
  bindto: '#profile_gauge',

  data:
  {
    columns: compliance_data,
    type: 'gauge',
  },

  color:
  {
      pattern: ['#FF0000', '#F97600', '#F6C600', '#60B044'], // the three color levels for the percentage values.
      threshold: {
          values: [30, 60, 90, 100]
      }
  },
  size:
  {
      height: 240
  }
});
}

function draw_tree_map()
{
  google.charts.load('current',
  {
    'packages': ['treemap']
  });

  google.charts.setOnLoadCallback(drawChart);
  var treemapData = getTreeMapData()

  function drawChart()
  {
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'ID');
    data.addColumn('string', 'Parent');
    data.addColumn('number', 'Number Of Lines');
    data.addRows(treemapData);

    var tree = new google.visualization.TreeMap(document.getElementById('nist_treemap'));

    var options = {
      highlightOnMouseOver: true,
      maxDepth: 1,
      maxPostDepth: 2,
      noColor: "#ffffff",

      minColor: '#FFFFFF',
      midColor: '#FF0000',
      maxColor: '#00FF00',
      headerHeight: 15,
      showScale: true,
      // height: 300,
      // width: 880,
      showScale: false  ,


      useWeightedAverageForAggregation: true
    };
    function myOnClickFunction() {
      update_treemap_colors()
    }
    google.visualization.events.addListener(tree, 'select', myOnClickFunction);

    tree.draw(data, options);
    update_treemap_colors();
  }

  $(window).resize(function()
  {
  drawChart();
  });

}


function update_treemap_colors() {
  // the google treemap generates predictable colors based on the value of the block assigned by getTreeMapData()
  // each block color is updated to its appropirate status color if it does not have status it is replaced to white(FFFFFF)
    if (status_count['not_a_finding_count'] > 0 )
    {
      $('#nist_treemap').children('div').children('div').children('div').children('svg').children('g').each(function() {
        if ($(this).children('rect').attr('fill') === '#7f8000') {
          $(this).children('rect').css({
            fill: "#C8EFF1" //NA
          });

        } else if ($(this).children('rect').attr('fill') === '#ff0000') {
          $(this).children('rect').css({
            fill: "#FFC857" //NR
          });

        } else if ($(this).children('rect').attr('fill') === '#00ff00') {
          $(this).children('rect').css({
            fill: "#89CC51" //NAF
          });

        } else if ($(this).children('rect').attr('fill') === '#ff7f7f') {
          $(this).children('rect').css({
            fill: "#FF0029" //O
          });
        }
        else {
        $(this).children('rect').css({
            fill: "#FFFFFF" // everything else
          });
        }
      });
    } else if (status_count['not_applicable_count'] > 0 )
    {
      $('#nist_treemap').children('div').children('div').children('div').children('svg').children('g').each(function() {
        if ($(this).children('rect').attr('fill') === '#00ff00') {
          $(this).children('rect').css({
            fill: "#C8EFF1" //NA // everything else
          });

        } else if ($(this).children('rect').attr('fill') === '#7f8000') {
          $(this).children('rect').css({
            fill: "#FFC857" //NR // everything else
          });

        } else if ($(this).children('rect').attr('fill') === '#ff0000') {
          $(this).children('rect').css({
            fill: "#FF0029" //O // everything else
          });

        } else {
        $(this).children('rect').css({
            fill: "#FFFFFF" // everything else
          });
        }
      });
    } else if (status_count['not_reviewed_count'] > 0 )
    {
      $('#nist_treemap').children('div').children('div').children('div').children('svg').children('g').each(function() {
       if ($(this).children('rect').attr('fill') === '#00ff00') {
          $(this).children('rect').css({
            fill: "#FFC857" //NR
          });

        } else if ($(this).children('rect').attr('fill') === '#7f8000') {
          $(this).children('rect').css({
            fill: "#FF0029" //O
          });

        }
        else {
        $(this).children('rect').css({
            fill: "#FFFFFF" // everything else
          });
        }
      });
    } else if (status_count['open_count'] > 0 )
    {
      $('#nist_treemap').children('div').children('div').children('div').children('svg').children('g').each(function() {
        if ($(this).children('rect').attr('fill') === '#00ff00') {
          $(this).children('rect').css({
            fill: "#FF0029" //O
          });

        } else {
        $(this).children('rect').css({
            fill: "#FFFFFF" // everything else
          });
        }
      });
    } else
    {
      $('#nist_treemap').children('div').children('div').children('div').children('svg').children('g').each(function() {
        $(this).children('rect').css({
            fill: "#FFFFFF" // everything else
          });

      });
    }
}

function getTreeMapData()
{
  // https://developers.google.com/chart/interactive/docs/gallery/treemap
 var treeMapData = [['NIST 800 53',null,0],['AC','NIST 800 53',null],['AU','NIST 800 53',null],['AT','NIST 800 53',null],['CM','NIST 800 53',null],['CP','NIST 800 53',null],['IA','NIST 800 53',null],['IR','NIST 800 53',null],['MA','NIST 800 53',null],['MP','NIST 800 53',null],['PS','NIST 800 53',null],['PE','NIST 800 53',null],['PL','NIST 800 53',null],['PM','NIST 800 53',null],['RA','NIST 800 53',null],['CA','NIST 800 53',null],['SC','NIST 800 53',null],['SI','NIST 800 53',null],['SA','NIST 800 53',null],['UM','NIST 800 53',null],['AC-1','AC',1],['AC-2','AC',1],['AC-3','AC',1],['AC-4','AC',1],['AC-5','AC',1],['AC-6','AC',1],['AC-7','AC',1],['AC-8','AC',1],['AC-9','AC',1],['AC-10','AC',1],['AC-11','AC',1],['AC-12','AC',1],['AC-13','AC',1],['AC-14','AC',1],['AC-15','AC',1],['AC-16','AC',1],['AC-17','AC',1],['AC-18','AC',1],['AC-19','AC',1],['AC-20','AC',1],['AC-21','AC',1],['AC-22','AC',1],['AC-23','AC',1],['AC-24','AC',1],['AC-25','AC',1],['AU-1','AU',1],['AU-2','AU',1],['AU-3','AU',1],['AU-4','AU',1],['AU-5','AU',1],['AU-6','AU',1],['AU-7','AU',1],['AU-8','AU',1],['AU-9','AU',1],['AU-10','AU',1],['AU-11','AU',1],['AU-12','AU',1],['AU-13','AU',1],['AU-14','AU',1],['AU-15','AU',1],['AU-16','AU',1],['AT-1','AT',1],['AT-2','AT',1],['AT-3','AT',1],['AT-4','AT',1],['AT-5','AT',1],['CM-1','CM',1],['CM-2','CM',1],['CM-3','CM',1],['CM-4','CM',1],['CM-5','CM',1],['CM-6','CM',1],['CM-7','CM',1],['CM-8','CM',1],['CM-9','CM',1],['CM-10','CM',1],['CM-11','CM',1],['CP-1','CP',1],['CP-2','CP',1],['CP-3','CP',1],['CP-4','CP',1],['CP-5','CP',1],['CP-6','CP',1],['CP-7','CP',1],['CP-8','CP',1],['CP-9','CP',1],['CP-10','CP',1],['CP-11','CP',1],['CP-12','CP',1],['CP-13','CP',1],['IA-1','IA',1],['IA-2','IA',1],['IA-3','IA',1],['IA-4','IA',1],['IA-5','IA',1],['IA-6','IA',1],['IA-7','IA',1],['IA-8','IA',1],['IA-9','IA',1],['IA-10','IA',1],['IA-11','IA',1],['IR-1','IR',1],['IR-2','IR',1],['IR-3','IR',1],['IR-4','IR',1],['IR-5','IR',1],['IR-6','IR',1],['IR-7','IR',1],['IR-8','IR',1],['IR-9','IR',1],['IR-10','IR',1],['MA-1','MA',1],['MA-2','MA',1],['MA-3','MA',1],['MA-4','MA',1],['MA-5','MA',1],['MA-6','MA',1],['MP-1','MP',1],['MP-2','MP',1],['MP-3','MP',1],['MP-4','MP',1],['MP-5','MP',1],['MP-6','MP',1],['MP-7','MP',1],['MP-8','MP',1],['PS-1','PS',1],['PS-2','PS',1],['PS-3','PS',1],['PS-4','PS',1],['PS-5','PS',1],['PS-6','PS',1],['PS-7','PS',1],['PS-8','PS',1],['PE-1','PE',1],['PE-2','PE',1],['PE-3','PE',1],['PE-4','PE',1],['PE-5','PE',1],['PE-6','PE',1],['PE-7','PE',1],['PE-8','PE',1],['PE-9','PE',1],['PE-10','PE',1],['PE-11','PE',1],['PE-12','PE',1],['PE-13','PE',1],['PE-14','PE',1],['PE-15','PE',1],['PE-16','PE',1],['PE-17','PE',1],['PE-18','PE',1],['PE-19','PE',1],['PE-20','PE',1],['PL-1','PL',1],['PL-2','PL',1],['PL-3','PL',1],['PL-4','PL',1],['PL-5','PL',1],['PL-6','PL',1],['PL-7','PL',1],['PL-8','PL',1],['PL-9','PL',1],['PM-1','PM',1],['PM-2','PM',1],['PM-3','PM',1],['PM-4','PM',1],['PM-5','PM',1],['PM-6','PM',1],['PM-7','PM',1],['PM-8','PM',1],['PM-9','PM',1],['PM-10','PM',1],['PM-11','PM',1],['PM-12','PM',1],['PM-13','PM',1],['PM-14','PM',1],['PM-15','PM',1],['PM-16','PM',1],['RA-1','RA',1],['RA-2','RA',1],['RA-3','RA',1],['RA-4','RA',1],['RA-5','RA',1],['RA-6','RA',1],['CA-1','CA',1],['CA-2','CA',1],['CA-3','CA',1],['CA-4','CA',1],['CA-5','CA',1],['CA-6','CA',1],['CA-7','CA',1],['CA-8','CA',1],['CA-9','CA',1],['SC-1','SC',1],['SC-2','SC',1],['SC-3','SC',1],['SC-4','SC',1],['SC-5','SC',1],['SC-6','SC',1],['SC-7','SC',1],['SC-8','SC',1],['SC-9','SC',1],['SC-10','SC',1],['SC-11','SC',1],['SC-12','SC',1],['SC-13','SC',1],['SC-14','SC',1],['SC-15','SC',1],['SC-16','SC',1],['SC-17','SC',1],['SC-18','SC',1],['SC-19','SC',1],['SC-20','SC',1],['SC-21','SC',1],['SC-22','SC',1],['SC-23','SC',1],['SC-24','SC',1],['SC-25','SC',1],['SC-26','SC',1],['SC-27','SC',1],['SC-28','SC',1],['SC-29','SC',1],['SC-30','SC',1],['SC-31','SC',1],['SC-32','SC',1],['SC-33','SC',1],['SC-34','SC',1],['SC-35','SC',1],['SC-36','SC',1],['SC-37','SC',1],['SC-38','SC',1],['SC-39','SC',1],['SC-40','SC',1],['SC-41','SC',1],['SC-42','SC',1],['SC-43','SC',1],['SC-44','SC',1],['SI-1','SI',1],['SI-2','SI',1],['SI-3','SI',1],['SI-4','SI',1],['SI-5','SI',1],['SI-6','SI',1],['SI-7','SI',1],['SI-8','SI',1],['SI-9','SI',1],['SI-10','SI',1],['SI-11','SI',1],['SI-12','SI',1],['SI-13','SI',1],['SI-14','SI',1],['SI-15','SI',1],['SI-16','SI',1],['SI-17','SI',1],['SA-1','SA',1],['SA-2','SA',1],['SA-3','SA',1],['SA-4','SA',1],['SA-5','SA',1],['SA-6','SA',1],['SA-7','SA',1],['SA-8','SA',1],['SA-9','SA',1],['SA-10','SA',1],['SA-11','SA',1],['SA-12','SA',1],['SA-13','SA',1],['SA-14','SA',1],['SA-15','SA',1],['SA-16','SA',1],['SA-17','SA',1],['SA-18','SA',1],['SA-19','SA',1],['SA-20','SA',1],['SA-21','SA',1],['SA-22','SA',1]]
    var id = 1;
    for (var i = 0; i < dataSet.length; i++)
    {
      var control = dataSet[i];
      for(var j = 0; j < control.nist.length; j++)
      {
        // standard nist style format is ['AC=1', 'Rev_4']
        if (!control.nist[j].match(/Rev/))
        {
          var record = [];
          var hash = {};
          hash.v = (id++).toString();
          hash.f = control.vuln_num;
          record.push(hash);
          // if item does not match format 'AC-1' it is marked unmapped
          nist_tag = control.nist[j].match(/[a-zA-Z][a-zA-Z+]-[\d+]/);
          if(nist_tag) {
            record.push(nist_tag[0]);
          }
          else {
            record.push('UM')
          }
          if (control.result === 'NotAFinding')
              {
                  record.push(1.4);
              }
          if (control.result === 'Open')
              {

                  record.push(1.1);
              }
          if (control.result === 'Not_Applicable')
              {

                  record.push(1.3);
              }
          if (control.result === 'Not_Reviewed')
              {

                  record.push(1.2);
              }
          if (control.result === 'Not_Tested')
              {
                  record.push(1.0);
              }
          treeMapData.push(record);
        }
      }
    }
    return treeMapData
}



var data_filter =
{
  'result' : '*',
  'severity' : '*',
}

function filterDataset ()
{
  dataSet = raw_dataSet;
  if (data_filter.result != '*')
  {
    dataSet = $(dataSet).filter(function (i,n){return n.result === data_filter.result ;});
  }
  if (data_filter.severity != '*')
  {
    dataSet = $(dataSet).filter(function (i,n){return n.severity === data_filter.severity ;});
  }
  return dataSet;
}

$("#clear_filters_button").click(function()
{
  document.getElementById("clear_filters_button").style.visibility = "hidden";
  data_filter =
  {
    'result' : '*',
    'severity' : '*',
  };
  load_views();
});


function filter(keyword)
{
  dataSet.filter(function (i,n)
  {
    return n.result==='keyword';
  });
}

function draw_ssp_table()
{
    dataSet = filterDataset();
    controls = getAllNistControls(dataSet);
    groupedControls = getGroupedControls(controls, dataSet)

    //Add elements to the list
    var ssp_ul = document.getElementById("sspList");

    // Create the panel group
    var link_counter = 0;
    var title_counter = 0;
    groupedControls.forEach( function (family) {
        //Create high level panel group and panel which everything will be appended too
        var panel_group_div = document.createElement('div');
        panel_group_div.classList.add('panel-group');
        ssp_ul.appendChild(panel_group_div);
        var panel_div = document.createElement('div');
        panel_div.classList.add('panel');
        panel_div.classList.add('panel-default');
        panel_group_div.appendChild(panel_div);

        var family_heading_div = document.createElement('div');
        family_heading_div.classList.add('panel_heading');
        panel_div.appendChild(family_heading_div);
        var family_title_h = document.createElement('h4');
        family_title_h.classList.add('panel-title');
        family_heading_div.appendChild(family_title_h);
        var family_a = document.createElement("a");
        family_a.setAttribute('data-toggle', "collapse");
        family_a.setAttribute('href', "#" + family.name + "_div");
        family_a.innerHTML = family.name;
        family_title_h.appendChild(family_a);

        //Create the family div and append it to the panel
        var family_div = document.createElement('div');
        family_div.setAttribute('id', family.name + "_div");
        family_div.classList.add('panel-collapse');
        family_div.classList.add('collapse');
        panel_div.appendChild(family_div);

        //Create the heading for the system name and append it to the family_div
        var system_heading_div = document.createElement('div');
        system_heading_div.classList.add('panel-heading');
        family_div.append(system_heading_div);

        //Create the system title and append it to the system_heading_div
        var system_title_h = document.createElement('h4');
        system_title_h.classList.add('panel-title');
        system_heading_div.appendChild(system_title_h);

        //Create the title object a and append it to the system_title_h
        var system_name_a = document.createElement('a');
        system_name_a.setAttribute("data-toggle", "collapse");
        system_name_a.setAttribute("href", "#" + link_counter.toString());
        system_name_a.innerHTML = document.getElementById('profile_name').innerHTML;
        system_title_h.appendChild(system_name_a);

        // Create the tests_div and append it to the family_div
        var tests_div = document.createElement('div');
        tests_div.classList.add('panel-collapse');
        tests_div.classList.add('collapse');
        tests_div.setAttribute("id", link_counter.toString());
        family_div.appendChild(tests_div);
        link_counter += 1;

        var counter = 1;

        //Loop through each control test. Create a heading and div for each test
        family.controls.forEach( function (control) {
            var result = '';
            if (control.result == 'Open') {
                result = 'Other Than Satisfied';
            } else if (control.result == 'NotAFinding') {
                result = 'Satisfied';
            } else {
                result = "Not_Tested";
            }
            //Create the title heading dive
            var test_heading_div = document.createElement('div');
            test_heading_div.classList.add('panel-heading');
            tests_div.appendChild(test_heading_div)

            //create the title panel-title and append it to the test_heading div
            var test_title_h = document.createElement('h4');
            test_title_h.classList.add('panel-title');
            test_heading_div.appendChild(test_title_h);

            //Create the test a element and append it to the test_title_h
            var test_title_a = document.createElement('a');
            test_title_a.setAttribute('data-toggle', 'collapse');
            test_title_a.setAttribute('href', "#title" + title_counter.toString());
            test_title_a.appendChild(document.createTextNode(counter.toString() + '. (' + result + ') ' +  control.rule_title));
            test_title_h.appendChild(test_title_a);
            counter += 1;

            //create the list of objects that will be opened when the title is clicked
            var attributes_panel_div = document.createElement('div');
            attributes_panel_div.classList.add('panel-collapse');
            attributes_panel_div.classList.add('collapse');
            attributes_panel_div.setAttribute('id', 'title' + title_counter.toString() );
            title_counter += 1;
            tests_div.appendChild(attributes_panel_div);

            // Create the list group and append it to the attributes_panel_div
            var attributes_list_group = document.createElement('ul');
            attributes_list_group.classList.add('list-group');
            attributes_list_group.style.marginLeft = '20px';
            attributes_panel_div.appendChild(attributes_list_group);

            var disc_li = document.createElement('li');
            disc_li.classList.add('list-group-item');
            disc_li.appendChild(document.createTextNode("Discussion: " + control.vuln_discuss));
            attributes_list_group.appendChild(disc_li);
            var check_li = document.createElement('li');
            check_li.classList.add('list-group-item');
            check_li.appendChild(document.createTextNode("Check: " + control.check_content));
            attributes_list_group.appendChild(check_li);
            var fix_li = document.createElement('li');
            fix_li.classList.add('list-group-item');
            fix_li.appendChild(document.createTextNode("Fix: " + control.fix_text));
            attributes_list_group.appendChild(fix_li);
        });
    });
}

function getGroupedControls(controls, dataSet)
{
    var groupedControls = []
    for (var i = 0; i < controls.length; i ++) {
        var groupedControl = {'name': controls[i], 'controls': []};
        dataSet.forEach(function(test) {
            if (test.nist[0].includes(controls[i])) {
                groupedControl['controls'].push(test);
            }
        });
        groupedControls.push(groupedControl);
    }
    return groupedControls;
}

function getAllNistControls(dataSet)
{
    var controls = {};
    dataSet.forEach(function(test) {
        nist_tag = test.nist[0].match(/\w\w-\d*/)[0];
        if (controls.nist_tag != 1)
        {
            controls[nist_tag] = 1;
        }
    });
    controls = Object.keys(controls).sort();

    return controls;
}
