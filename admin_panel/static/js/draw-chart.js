function newDate(day) {
			//return moment().add(days, 'd').toDate();
    return moment().subtract(day, 'day').format('jM/jD');
    //return moment().jYear();
}

var colors = ['#CD5C5C', '#32CD32', '#C71585', '#FF4500', '#FFFF00', '#0000FF', '#FF00FF', '#2F4F4F', '#FF0000', '#228B22', '#BC8F8F', '#BDB76B', '#800000', '#F4A460', '#2E8B57', '#E9967A', '#FF8C00', '#808000', '#D2691E', '#696969', '#2F4F4F', '#483D8B', '#8B008B', '#FFFF00', '#006400', '#8B0000', '#7FFF00', '#BC8F8F', '#FFDEAD', '#D2691E', '#9932CC', '#4169E1', '#808080'];

var my_chart;
function create_chart(ctx, chart_type, data, chart_options){
    my_chart = new Chart(ctx, {
    type: chart_type,
    data: data,
    options: chart_options
  });
}

function color_generator(chart_type, num_element){
    var back_colors = [];
    if (chart_type === 'pie'){
    for (var i = 0; i < num_element ; i ++)
        back_colors[i] = colors[i];
    return back_colors;
    }
    else if(chart_type === 'bar'){
        for (var j = 0; j < num_element ; j ++)
        back_colors[j] = 'darkorange';
        return back_colors;
    }
    else{
        return window.chartColors.red;
    }
}


function draw_chart(labels, values, chart_type) {
    var ctx = document.getElementById('myChart').getContext('2d');
    var options =  {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]

				}
        };
    //var myChart = new Chart(ctx, {
    //type: chart_type,
    var back_colors = color_generator(chart_type, values.length);
    var chart_data= {
        labels: labels,
        //labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        /*labels:[
            newDate(6),
            newDate(5),
            newDate(4),
            newDate(3),
            newDate(2),
            newDate(1),
            newDate(0)
        ],*/
        datasets:[{
            label: 'قیمت محصولات',
            //data: [12, 19, 3, 5, 2, 3, 12],
            data: values,
            backgroundColor: back_colors,
                /*[
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
                'rgba(255, 206, 86, 1)'
              //  'rgba(255, 255, 100, 1)'
            ],*/
           /* borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],*/
            borderWidth: 1,
            borderColor:back_colors,
            fill:false
        }]
    };
    create_chart(ctx, chart_type, chart_data, options);
    /*
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]

				}
        }

});*/
}


function get_data(chart_type) {
    var url = 'get/chart/data';
    var method = "GET";
    $.ajax({
                   url : url ,
                   method : method ,
                   success: function (response_data) {
                        console.log(response_data);
                        draw_chart(response_data.labels, response_data.values, chart_type);
                   } ,
                   error:function () {
                       alert("Ooooops");
                   }
               });
}

function update_chart() {
    var element = document.getElementById('chart-type');
    var chart_type = change_chart_type(element);
    my_chart.destroy();
    get_data(chart_type);
}

function change_chart_type(element) {
    var type = element.value;
    var chart_type = '';
    if(type === "خطی") chart_type = 'line';
    else if(type === "ستونی") chart_type = 'bar';
    else if(type === "دایره ای") chart_type = 'pie';
    return chart_type;

}