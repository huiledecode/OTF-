
$(document).ready(function () {
    /* initialize the external events
     -----------------------------------------------------------------*/
    function ini_events(ele) {
      ele.each(function () {

        // create an Event Object (http://arshaw.com/fullcalendar/docs/event_data/Event_Object/)
        // it doesn't need to have a start or end
        var eventObject = {
          title: $.trim($(this).text()), // use the element's text as the event title
          stick:true
        };

        // store the Event Object in the DOM element so we can get to it later
        $(this).data('eventObject', eventObject);

        // make the event draggable using jQuery UI
        $(this).draggable({
          zIndex: 1070,
          revert: true, // will cause the event to go back to its
          revertDuration: 0  //  original position after the drag
        });

      });
    }
    ini_events($('#external-events div.external-event'));

    /* initialize the calendar
     -----------------------------------------------------------------*/
    var id_usager = $("#id_usager").val();
    if(id_usager){

      //Date for the calendar events (dummy data)
      var date = new Date();
      var d = date.getDate(),
              m = date.getMonth(),
              y = date.getFullYear();
      $('#calendar').fullCalendar({
        header: {
          left: 'prev,next today',
          center: 'title',
          right: 'month,agendaWeek,agendaDay'
        },
        events: '/json/agendabyusager?id_usager='+id_usager,
        timezone:'UTC',
        lang: 'fr',
  			weekNumbers: true,
        editable: true,
        eventRender: function(event, element, view) {
            element.find('.fc-content').append( "<span class='closeon'>x</span>" );
            element.find(".closeon").click(function() {
              if (confirm("Êtes-vous sûr de vouloir supprimer cet évènement ?")) {
                  $.ajax({
                      type: "POST",
                      url: "json/supprimer_event",
                      data: "&_id="+event._id,
                      success: function(msg){
                          try{
                              // console.log("### supprimer_event msg: ",msg);
                              $('#calendar').fullCalendar('removeEvents',event._id);
                          }catch(err){
                            console.log("Catch Erreur : ", err);
                          }
                      },
                      error: function(msg){
                          console.log("Erreur : ", msg);
                      }
                  });
              }
            });
        },
        eventResize: function(event, delta, revertFunc) {
// console.log("########## moment(event.end.format()).utc() : ", moment(event.end.format()).utc());
// console.log("########## moment(event.end.format()).format() : ", moment(event.end.format()).toDate());
          var endDate = moment(event.end.format()).utc();// date with time UTC
          if(event.allDay)
            endDate = moment(event.end.format()).toDate();// date without time

          $.ajax({
              type: "POST",
              url: "json/modifier_event",
              data: "&_id="+event._id+"&usager="+id_usager+"&timezone=UTC&end_noformat=true&end="+endDate,
              success: function(msg){
                  try{
                      console.log("### modifier_event msg: ",msg);
                  }catch(err){
                    revertFunc();
                    console.log("Catch Erreur : ", err);
                  }
              },
              error: function(msg){
                  console.log("Erreur : ", msg);
                  revertFunc();
              }
          });
        },
        eventDrop: function(event, delta, revertFunc) {
  // console.log("###### eventDrop : ", moment(event.start.format()).utc().toDate());
          var startDate = moment(event.start.format()).utc();// date with time UTC
          var endDate = moment(event.end.format()).utc();// date with time UTC
          if(event.allDay){
            startDate = moment(event.start.format()).utc().toDate();
            endDate = moment(event.end.format()).utc().toDate();// date without T
          }

          $.ajax({
              type: "POST",
              url: "json/modifier_event",
              data: "&_id="+event._id+"&usager="+id_usager+"&timezone=UTC&end_noformat=true&end="+endDate+"&start_noformat=true&start="+startDate,
              success: function(msg){
                  try{
                      console.log("### modifier_event msg: ",msg);
                  }catch(err){
                    revertFunc();
                    console.log("Catch Erreur : ", err);
                  }
              },
              error: function(msg){
                  console.log("Erreur : ", msg);
                  revertFunc();
              }
          });

        },
        eventLimit: true,
        droppable: true, // this allows things to be dropped onto the calendar !!!
        drop: function (date, jsRender, ui) { // this function is called when something is dropped

          // retrieve the dropped element's stored Event Object
          var originalEventObject = $(this).data('eventObject');

          // we need to copy it, so that multiple events don't have a reference to the same object
          var copiedEventObject = $.extend({}, originalEventObject);

          var allDay = $('#allDay-event').is(':checked');
          var duration = $('#duration-event').val();
          if(!duration || duration*1 <= 0 )
            duration = 1;

          // assign it the date that was reported
          var startDate = new Date(date);
          copiedEventObject.start = moment(startDate).utc();
          var m = moment(startDate); // the day before DST in the US
          m.hours(); // 5
          m.add(duration, 'hours').hours();
          var endDate = m.utc();

          if(!allDay)
            copiedEventObject.end = endDate;
          else
            copiedEventObject.allDay = allDay;
          copiedEventObject.backgroundColor = $(this).css("background-color");
          copiedEventObject.borderColor = $(this).css("border-color");


          var add_url = "&usager="+id_usager;
          add_url += "&backgroundColor="+copiedEventObject.backgroundColor;
          add_url += "&borderColor="+copiedEventObject.borderColor;
          add_url += "&start="+date;
          add_url += "&title="+copiedEventObject.title;
          add_url += "&timezone=UTC";
          add_url += "&editable=true";
          if(!allDay)
            add_url += "&end="+endDate;
          else
            add_url += "&allDay=true";
// console.log("### add_event add_url: ",add_url);
          // render the event on the calendar
          // the last `true` argument determines if the event "sticks" (http://arshaw.com/fullcalendar/docs/event_rendering/renderEvent/)
          $.ajax({
              type: "POST",
              url: "json/add_event",
              data: add_url,
              success: function(response){
                  try{
                    console.log("### response : ",response);
                      //response = $.parseJSON(response);
// console.log("### add_event msg: ",response);
                      //retourner l'id dans le success
                      copiedEventObject._id = response.success._id;
                      $('#calendar').fullCalendar('renderEvent', copiedEventObject, true);
                  }catch(err){
                    console.log("Catch Erreur : ", err);
                  }
              },
              error: function(msg){
                  console.log("Erreur : ", msg);
                  revertFunc();
              }
          });


          // is the "remove after drop" checkbox checked?
          if ($('#drop-remove').is(':checked')) {
            // if so, remove the element from the "Draggable Events" list
            $(this).remove();
          }

        }
      });
    }

    $("#allDay-event").click(function (e) {
      $("#div_duration-event").toggle();
    });

    /* ADDING EVENTS */
    var currColor = "#3c8dbc"; //Red by default
    //Color chooser button
    var colorChooser = $("#color-chooser-btn");
    $("#color-chooser > li > a").click(function (e) {
      e.preventDefault();
      //Save color
      currColor = $(this).css("color");
      //Add color effect to button
      $('#add-new-event').css({"background-color": currColor, "border-color": currColor});
    });

    $("#add-new-event").click(function (e) {
      e.preventDefault();
      //Get value and make sure it is not null
      var val = $("#new-event").val();
      if (val.length == 0) {
        return;
      }

      //Create events
      var event = $("<div />");
      event.css({"background-color": currColor, "border-color": currColor, "color": "#fff"}).addClass("external-event");
      event.attr("data-allDay", false);
      event.attr("data-editable", true);
      event.html(val);
      var id_usager = $("#id_usager").val();
      $.ajax({
          type: "POST",
          url: "json/add_event_type",
          data: "&usager="+id_usager+"&libelle="+val+"&background_color="+currColor+"&border_color="+currColor+"&color=#fff",
          success: function(msg){
              try{
  // console.log("### $.parseJSON(msg) : ",$.parseJSON(msg))
                  $('#external-events').append(event);
                  //Add draggable funtionality
                  ini_events(event);
                  //Remove event from text input
                  $("#new-event").val("");
              }catch(err){
                console.log("Erreur : ", err);
              }
          }
      });
    });

});
