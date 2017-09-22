

function format ( d ) {
    // `d` is the original data object for the row
    return '<ul class="nav nav-tabs">'+
    '<li class="active"><a data-toggle="tab" href="#fdetails">Details</a></li>'+
    // '<li><a data-toggle="tab" href="#details" >Details</a></li>'+
    '<li onclick = test()><a data-toggle="tab" href="#inpec_code" >Inspec Code</a></li>'+
  '</ul>'+
  '<div class="tab-content">'+
    '<div id="fdetails" class="tab-pane fade in active">'+
      '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">'+
        '<tr>'+
            '<td>Control:</td>'+
            '<td>'+d.vuln_num+'</td>'+
        '</tr>'+
        '<tr>'+
            '<td>Title:</td>'+
            '<td>'+d.rule_title+'</td>'+
        '</tr>'+
        '<tr>'+
            '<td>Desc:</td>'+
            '<td>'+d.vuln_discuss+'</td>'+
        '</tr>'+
        '<tr>'+
            '<td>Severity:</td>'+
            '<td>'+d.severity+'</td>'+
        '</tr>'+
            '<td>Impact:</td>'+
            '<td>'+d.impact+'</td>'+
        '</tr>'+
        '<tr>'+
            '<td>Nist Ref:</td>'+
            '<td>'+d.nist+'</td>'+
        '</tr>'+
        // '<tr>'+
        //     '<td>Rationale:</td>'+
        //     '<td>'+d.rationale+'</td>'+
        // '</tr>'+
        // '<tr>'+
        //     '<td>CIS family:</td>'+
        //     '<td>'+d.cis_family+'</td>'+
        // '</tr>'+
        // '<tr>'+
        // '<tr>'+
        //     '<td>CIS rid:</td>'+
        //     '<td>'+d.cis_rid+'</td>'+
        // '</tr>'+
        // '<tr>'+
        //     '<td>CIS level:</td>'+
        //     '<td>'+d.cis_level+'</td>'+
        // '</tr>'+
        // '<tr>'+
            '<td>Check Text:</td>'+
            '<td>'+d.check_content+'</td>'+
        '</tr>'+
        '<tr>'+
            '<td>Fix Text:</td>'+
            '<td>'+d.fix_text+'</td>'+
        '</tr>'+
    '</table>'+
    '</div>'+
    '<div id="details" class="tab-pane fade">'+
      '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">'+
        '<tr>'+
            '<td>Control:</td>'+
            '<td>'+d.vuln_num+'</td>'+
        '</tr>'+
        '<tr>'+
            '<td>Title:</td>'+
            '<td>'+d.rule_title+'</td>'+
        '</tr>'+
        '<tr>'+
            '<td>Desc:</td>'+
            '<td>'+d.vuln_discuss+'</td>'+
        '</tr>'+
        '<tr>'+
            '<td>Severity:</td>'+
            '<td>'+d.severity+'</td>'+
        '</tr>'+
            '<td>Impact:</td>'+
            '<td>'+d.impact+'</td>'+
        '</tr>'+
        '<tr>'+
            '<td>Nist:</td>'+
            '<td>'+d.nist+'</td>'+
        '</tr>'+
        '<tr>'+
            '<td>Nist:</td>'+
            '<td>'+d.rationale+'</td>'+
        '</tr>'+
        '<tr>'+
            '<td>Nist:</td>'+
            '<td>'+d.cis_family+'</td>'+
        '</tr>'+
        '<tr>'+
        '<tr>'+
            '<td>Nist:</td>'+
            '<td>'+d.cis_rid+'</td>'+
        '</tr>'+
        '<tr>'+
            '<td>Nist:</td>'+
            '<td>'+d.cis_level+'</td>'+
        '</tr>'+
        '<tr>'+
            '<td>Check Text:</td>'+
            '<td>'+d.check_content+'</td>'+
        '</tr>'+
        '<tr>'+
            '<td>Fix Text:</td>'+
            '<td>'+d.fix_text+'</td>'+
        '</tr>'+
    '</table>'+
    '</div>'+
    '<div id="inpec_code" class="tab-pane fade">'+
      '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">'+
        '<tr>'+
            '<td><pre><code class="ruby">'+d.code+'</code></pre></td>'+
        '</tr>'+
    '</table>'+
    '</div>';
}


function load_tables() {
  dataSet = filterDataset();
  if ( $.fn.dataTable.isDataTable( '#results_table' ) ) {
  var datatable = $('#results_table').dataTable().api();
    datatable.clear();
    datatable.rows.add(dataSet);
    datatable.draw();
  }
  else
  {
    var table = $('#results_table').DataTable( {
         "iDisplayLength": 5,

  "rowCallback": function( row, data, index ) {
    // if ( data.result == "NotAFinding" ) {
    //   $('td:eq(0)', row).html( '<button class="btn btn-success" style="width:120px" >NotAFinding</button> ' );
    // }
    // if ( data.result == "Open" ) {
    //   $('td:eq(0)', row).html( '<button class="btn btn-danger" style="width:120px">Open</button> ' );
    // }
    // if ( data.result ==  "Not_Applicable") {
    //   $('td:eq(0)', row).html( '<button class="btn btn-info" style="width:120px">Not_Applicable</button> ' );
    // }
    // if ( data.result == "Not_Reviewed" ) {
    //   $('td:eq(0)', row).html( '<button class="btn btn-warning" style="width:120px">Not_Reviewed</button> ' );
    // }
    // if ( data.result == "Not_Tested" ) {
    //   $('td:eq(0)', row).html( '<button class="btn btn-warning" style="width:120px">Not_Tested</button> ' );
    // }
    $('td:eq(0)', row).html( '<button class="btn btn-success" style="width:120px">View Details</button> ' );
  },
        data: dataSet,
        "columns": [
            {
                "className":      'details-control',
                "orderable":      true,
                "data":           "result",
                "defaultContent": ''
            },
            { "data": "vuln_num" },
            // { "data": "result" },
            { "data": "severity" },
            { "data": "nist" }
        ],
        "order": [[1, 'asc']]
    } );

    // Add event listener for opening and closing details
    $('#results_table tbody').on('click', 'td.details-control', function () {
        // console.log("test");
        var tr = $(this).closest('tr');
        var row = table.row( tr );

         if ( row.child.isShown() ) {
         row.child.hide();
         tr.removeClass('shown');
        }
    else
        {
         if ( table.row( '.shown' ).length ) {
                  $('.details-control', table.row( '.shown' ).node()).click();
          }
          row.child( format(row.data()) ).show();
          tr.addClass('shown');
     }
    } );
}
var not_a_finding_count   = $(dataSet).filter(function (i,n){return n.result==='NotAFinding';}).length;
var open_count            = $(dataSet).filter(function (i,n){return n.result==='Open';}).length;
var not_applicable_count  = $(dataSet).filter(function (i,n){return n.result==='Not_Applicable';}).length;
var not_reviewed_count    = $(dataSet).filter(function (i,n){return n.result==='Not_Reviewed';}).length;
var not_tested_count      = $(dataSet).filter(function (i,n){return n.result==='Not_Tested';}).length;
var high_severity_count   = $(dataSet).filter(function (i,n){return n.severity==='high';}).length
var medium_severity_count = $(dataSet).filter(function (i,n){return n.severity==='medium';}).length
var low_severity_count    = $(dataSet).filter(function (i,n){return n.severity==='low';}).length



// console.log(dataSet);
// var pass = $(dataSet).filter(function (i,n){return n.result==='NotAFinding';}).length;
// alert(pass);
status_data = [
            ['Not A Finding', not_a_finding_count],
            ['Open', open_count],
            ['Not Applicable', not_applicable_count],
            ['Not Reviewed', not_reviewed_count],
        ];

c3.generate({
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
          load_tables();
        },
        // onmouseover: function (d, i) { console.log("onmouseover", d, i); },
        // onmouseout: function (d, i) { console.log("onmouseout", d, i); }
    },
    color: {
        pattern: ['rgb(137, 204, 81)', 'rgb(255, 0, 41)', 'rgb(0, 200, 241)', 'rgb(255, 200, 87)']
    },
    size: {
  height: 240
},
    donut: {
        title: "Control Status",
        label: {
        format: function (value, ratio, id) {
            return d3.format()(value);
            }

  }
    }
});
        var severity_pie = c3.generate({
    bindto: '#severity_pie',

    data: {
        columns: [
            ['CAT I', high_severity_count],
            ['CAT II', medium_severity_count],
            ['CAT III', low_severity_count],
        ],
        type : 'donut',
        onclick: function (d) {
          document.getElementById("clear_filters_button").style.visibility = "visible";
          if (d.id == 'CAT I'){
            data_filter.severity = 'high';
          }else if (d.id == 'CAT II'){
            data_filter.severity = 'medium';
          }else if (d.id == 'CAT III'){
            data_filter.severity = 'low';
          }
          load_tables();
        },
        // onmouseover: function (d, i) { console.log("onmouseover", d, i); },
        // onmouseout: function (d, i) { console.log("onmouseout", d, i); }
    },
        color: {
        pattern: ['rgb(255, 0, 41)','rgb(255, 200, 87)','rgb(137, 204, 81)' ]
    },
        size: {
  height: 320
},
    donut: {
        title: "Control Severity",
        label: {
        format: function (value, ratio, id) {
            return d3.format()(value);
            }
  }
    }
});

function score (){
    return ((not_a_finding_count + not_applicable_count)/dataSet.length)*100
    // console.log(dataSet.length)
}
        c3.generate({
        bindto: '#profile_gauge',

    data: {
        columns: [
            ['data', score ()]
        ],
        type: 'gauge',
        // onclick: function (d, i) { console.log("onclick", d, i); },
        // onmouseover: function (d, i) { console.log("onmouseover", d, i); },
        // onmouseout: function (d, i) { console.log("onmouseout", d, i); }
    },
    gauge: {
//        label: {
//            format: function(value, ratio) {
//                return value;
//            },
//            show: false // to turn off the min/max labels.
//        },
//    min: 0, // 0 is default, //can handle negative min e.g. vacuum / voltage / current flow / rate of change
//    max: 100, // 100 is default
//    units: ' %',
//    width: 39 // for adjusting arc thickness
    },
    color: {
        pattern: ['#FF0000', '#F97600', '#F6C600', '#60B044'], // the three color levels for the percentage values.
        threshold: {
//            unit: 'value', // percentage is default
//            max: 200, // 100 is default
            values: [30, 60, 90, 100]
        }
    },
    size: {
        height: 240
    }
});

      google.charts.load('current', {
        'packages': ['treemap']
      });
      google.charts.setOnLoadCallback(drawChart);
      var treemapData = getTreeMapData()
      function drawChart() {
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
          updateColors();
        }
        google.visualization.events.addListener(tree, 'select', myOnClickFunction);

        tree.draw(data, options);
        updateColors();
      }

$(window).resize(function(){
  drawChart();
});

    function updateColors() {
        if (high_severity_count > 0 )
        {
          $('#nist_treemap').children('div').children('div').children('div').children('svg').children('g').each(function() {
            if ($(this).children('rect').attr('fill') === '#aa5500') {
              $(this).children('rect').css({
                fill: "#FFC857" //NR
              });

            } else if ($(this).children('rect').attr('fill') === '#ff5555') {
              $(this).children('rect').css({
                fill: "#89CC51" //NAF
              });

            } else if ($(this).children('rect').attr('fill') === '#00ff00') {
              $(this).children('rect').css({
                fill: "#FF0029" //O
              });
            }
            else {
            $(this).children('rect').css({
                fill: "#FFFFFF"
              });
            }
          });
        } else if (medium_severity_count > 0 )
        {
          $('#nist_treemap').children('div').children('div').children('div').children('svg').children('g').each(function() {
            if ($(this).children('rect').attr('fill') === '#00ff00') {
              $(this).children('rect').css({
                fill: "#FFC857" //NR
              });

            } else if ($(this).children('rect').attr('fill') === '#aa5500') {
              $(this).children('rect').css({
                fill: "#89CC51" //NAF
              });

            } else {
            $(this).children('rect').css({
                fill: "#FFFFFF"
              });
            }
          });
        } else if (low_severity_count > 0 )
        {
          $('#nist_treemap').children('div').children('div').children('div').children('svg').children('g').each(function() {
            if ($(this).children('rect').attr('fill') === '#00ff00') {
              $(this).children('rect').css({
                fill: "#89CC51" //NAF
              });

            } else {
            $(this).children('rect').css({
                fill: "#FFFFFF"
              });
            }
          });
        } else
        {
          $('#nist_treemap').children('div').children('div').children('div').children('svg').children('g').each(function() {
            $(this).children('rect').css({
                fill: "#FFFFFF"
              });

          });
        }


    }


};



function getTreeMapData()
{
 var treeMapData = [['NIST 800 53',null,0],['AC','NIST 800 53',null],['AU','NIST 800 53',null],['AT','NIST 800 53',null],['CM','NIST 800 53',null],['CP','NIST 800 53',null],['IA','NIST 800 53',null],['IR','NIST 800 53',null],['MA','NIST 800 53',null],['MP','NIST 800 53',null],['PS','NIST 800 53',null],['PE','NIST 800 53',null],['PL','NIST 800 53',null],['PM','NIST 800 53',null],['RA','NIST 800 53',null],['CA','NIST 800 53',null],['SC','NIST 800 53',null],['SI','NIST 800 53',null],['SA','NIST 800 53',null],['UM','NIST 800 53',null],['AC-1','AC',1],['AC-2','AC',1],['AC-3','AC',1],['AC-4','AC',1],['AC-5','AC',1],['AC-6','AC',1],['AC-7','AC',1],['AC-8','AC',1],['AC-9','AC',1],['AC-10','AC',1],['AC-11','AC',1],['AC-12','AC',1],['AC-13','AC',1],['AC-14','AC',1],['AC-15','AC',1],['AC-16','AC',1],['AC-17','AC',1],['AC-18','AC',1],['AC-19','AC',1],['AC-20','AC',1],['AC-21','AC',1],['AC-22','AC',1],['AC-23','AC',1],['AC-24','AC',1],['AC-25','AC',1],['AU-1','AU',1],['AU-2','AU',1],['AU-3','AU',1],['AU-4','AU',1],['AU-5','AU',1],['AU-6','AU',1],['AU-7','AU',1],['AU-8','AU',1],['AU-9','AU',1],['AU-10','AU',1],['AU-11','AU',1],['AU-12','AU',1],['AU-13','AU',1],['AU-14','AU',1],['AU-15','AU',1],['AU-16','AU',1],['AT-1','AT',1],['AT-2','AT',1],['AT-3','AT',1],['AT-4','AT',1],['AT-5','AT',1],['CM-1','CM',1],['CM-2','CM',1],['CM-3','CM',1],['CM-4','CM',1],['CM-5','CM',1],['CM-6','CM',1],['CM-7','CM',1],['CM-8','CM',1],['CM-9','CM',1],['CM-10','CM',1],['CM-11','CM',1],['CP-1','CP',1],['CP-2','CP',1],['CP-3','CP',1],['CP-4','CP',1],['CP-5','CP',1],['CP-6','CP',1],['CP-7','CP',1],['CP-8','CP',1],['CP-9','CP',1],['CP-10','CP',1],['CP-11','CP',1],['CP-12','CP',1],['CP-13','CP',1],['IA-1','IA',1],['IA-2','IA',1],['IA-3','IA',1],['IA-4','IA',1],['IA-5','IA',1],['IA-6','IA',1],['IA-7','IA',1],['IA-8','IA',1],['IA-9','IA',1],['IA-10','IA',1],['IA-11','IA',1],['IR-1','IR',1],['IR-2','IR',1],['IR-3','IR',1],['IR-4','IR',1],['IR-5','IR',1],['IR-6','IR',1],['IR-7','IR',1],['IR-8','IR',1],['IR-9','IR',1],['IR-10','IR',1],['MA-1','MA',1],['MA-2','MA',1],['MA-3','MA',1],['MA-4','MA',1],['MA-5','MA',1],['MA-6','MA',1],['MP-1','MP',1],['MP-2','MP',1],['MP-3','MP',1],['MP-4','MP',1],['MP-5','MP',1],['MP-6','MP',1],['MP-7','MP',1],['MP-8','MP',1],['PS-1','PS',1],['PS-2','PS',1],['PS-3','PS',1],['PS-4','PS',1],['PS-5','PS',1],['PS-6','PS',1],['PS-7','PS',1],['PS-8','PS',1],['PE-1','PE',1],['PE-2','PE',1],['PE-3','PE',1],['PE-4','PE',1],['PE-5','PE',1],['PE-6','PE',1],['PE-7','PE',1],['PE-8','PE',1],['PE-9','PE',1],['PE-10','PE',1],['PE-11','PE',1],['PE-12','PE',1],['PE-13','PE',1],['PE-14','PE',1],['PE-15','PE',1],['PE-16','PE',1],['PE-17','PE',1],['PE-18','PE',1],['PE-19','PE',1],['PE-20','PE',1],['PL-1','PL',1],['PL-2','PL',1],['PL-3','PL',1],['PL-4','PL',1],['PL-5','PL',1],['PL-6','PL',1],['PL-7','PL',1],['PL-8','PL',1],['PL-9','PL',1],['PM-1','PM',1],['PM-2','PM',1],['PM-3','PM',1],['PM-4','PM',1],['PM-5','PM',1],['PM-6','PM',1],['PM-7','PM',1],['PM-8','PM',1],['PM-9','PM',1],['PM-10','PM',1],['PM-11','PM',1],['PM-12','PM',1],['PM-13','PM',1],['PM-14','PM',1],['PM-15','PM',1],['PM-16','PM',1],['RA-1','RA',1],['RA-2','RA',1],['RA-3','RA',1],['RA-4','RA',1],['RA-5','RA',1],['RA-6','RA',1],['CA-1','CA',1],['CA-2','CA',1],['CA-3','CA',1],['CA-4','CA',1],['CA-5','CA',1],['CA-6','CA',1],['CA-7','CA',1],['CA-8','CA',1],['CA-9','CA',1],['SC-1','SC',1],['SC-2','SC',1],['SC-3','SC',1],['SC-4','SC',1],['SC-5','SC',1],['SC-6','SC',1],['SC-7','SC',1],['SC-8','SC',1],['SC-9','SC',1],['SC-10','SC',1],['SC-11','SC',1],['SC-12','SC',1],['SC-13','SC',1],['SC-14','SC',1],['SC-15','SC',1],['SC-16','SC',1],['SC-17','SC',1],['SC-18','SC',1],['SC-19','SC',1],['SC-20','SC',1],['SC-21','SC',1],['SC-22','SC',1],['SC-23','SC',1],['SC-24','SC',1],['SC-25','SC',1],['SC-26','SC',1],['SC-27','SC',1],['SC-28','SC',1],['SC-29','SC',1],['SC-30','SC',1],['SC-31','SC',1],['SC-32','SC',1],['SC-33','SC',1],['SC-34','SC',1],['SC-35','SC',1],['SC-36','SC',1],['SC-37','SC',1],['SC-38','SC',1],['SC-39','SC',1],['SC-40','SC',1],['SC-41','SC',1],['SC-42','SC',1],['SC-43','SC',1],['SC-44','SC',1],['SI-1','SI',1],['SI-2','SI',1],['SI-3','SI',1],['SI-4','SI',1],['SI-5','SI',1],['SI-6','SI',1],['SI-7','SI',1],['SI-8','SI',1],['SI-9','SI',1],['SI-10','SI',1],['SI-11','SI',1],['SI-12','SI',1],['SI-13','SI',1],['SI-14','SI',1],['SI-15','SI',1],['SI-16','SI',1],['SI-17','SI',1],['SA-1','SA',1],['SA-2','SA',1],['SA-3','SA',1],['SA-4','SA',1],['SA-5','SA',1],['SA-6','SA',1],['SA-7','SA',1],['SA-8','SA',1],['SA-9','SA',1],['SA-10','SA',1],['SA-11','SA',1],['SA-12','SA',1],['SA-13','SA',1],['SA-14','SA',1],['SA-15','SA',1],['SA-16','SA',1],['SA-17','SA',1],['SA-18','SA',1],['SA-19','SA',1],['SA-20','SA',1],['SA-21','SA',1],['SA-22','SA',1]]
    var id = 1;
    for (var i = 0; i < dataSet.length; i++)
    {
        var control = dataSet[i];
        for(var j = 0; j < control.nist.length; j++)
        {

            if (!control.nist[j].match(/Rev/))
                {
                    var record = [];
                    var hash = {};

                    hash.v = (id++).toString();
                    hash.f = control.vuln_num;
                    record.push(hash);
                    nist_tag = control.nist[j].match(/[a-zA-Z][a-zA-Z+]-[\d+]/);
                    if(nist_tag) {
                      record.push(nist_tag[0]);
                    }
                    else {
                      record.push('UM')
                    }
                    // console.log(control.vuln_num+":"+nist_tag+':'+control.severity);
                    if (control.severity === 'low')
                        {
                            record.push(1.1);
                        }
                    if (control.severity === 'medium')
                        {
                            record.push(1.2);
                        }
                    if (control.severity === 'high')
                        {
                            record.push(1.3);
                        }
                    if (control.severity === 'invalid')
                        {
                            record.push(1.3);
                        }

                    // console.log(record)
                    treeMapData.push(record);
                }

        }
    }
    return treeMapData
}




var data_filter = {
  'result' : '*',
  'severity' : '*',
}

// var dataSet = [];

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

$("#clear_filters_button").click(function(){
  document.getElementById("clear_filters_button").style.visibility = "hidden";
  data_filter = {
  'result' : '*',
  'severity' : '*',
};
load_tables();
});

function filter(keyword){
    dataSet.filter(function (i,n){
        return n.result==='keyword';
    });
}


// console.log(filter('NotAFinding'))
