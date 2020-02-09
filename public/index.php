<!DOCTYPE html>
<html>

<head>
    <meta charsroundet="UTF-8">
    <title>round</title>
    <link rel="stylesheet" href="assets/styling/main.css">


    <script src="./assets/js/util/socket.io.js"></script>
    <script src="./assets/js/util/p5.min.js"></script>
    <script src="./assets/js/util/dom-to-image.min.js"></script>

    <script type="text/javascript" src="assets/js/util/html2canvas.min.js"></script>

    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.7.3/addons/p5.dom.min.js"></script>
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.7.3/addons/p5.sound.min.js">
    </script>


    <script src="//ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js" type="text/javascript"></script>

    <script src="./assets/js/main.js"></script>
    <script src="./assets/js/draw.js"></script> 

    <script src="assets/js/game.js"></script>


</head>

<body>
    
    <div id="landing">
        <div class="inner">
        
        
        <center><h3>round.ph</h3></center>
        <p>provide at least five minutes to reflect (not alone). there will be prompts on the screen. these are questions by searching and walking through the world. take time to look at things, walk down familiar and unfamiliar roads, or take yourself to the unknown (if it is possible). you may <em>search, remember, or find</em>.</p>
            
            
        <p>you may use your phone or browser. the experience is never complete if you are alone. ask the people around you (or a stranger) to come and join.</p>
    
            <div class="credits">
                <a href="https://chia.dev">chia.dev</a>
        
            </div>
        </div>
    </div>

    <div id="container" class="container">

        <div class="box">

            <div class="time">
                <span class="tell_time" id="loc_lat">14.5995</span>
                <span class="tell_time" id="loc_lng"> 120.9842</span>
            </div>


            <center>
                <div class="travel-place">
                    <h2> <span id="loc_name">...</span></h2>
                    <br>


                    <input type="text" id="field_loc" name="location" placeholder="Tell me a place">
<br>
                    <button type="button" class="find" onclick="letters._findPlace()">search</button>

                    <button type="button" class="remember" onclick="letters._saveImage()">remember</button>
                    
                    <button type="button" class="explore" onclick="letters.findLetter()">find</button>
                    

                    <!--
  <input type="text" name="custom_color" placeholder="#ff0000" id="pickcolor" class="call-picker" />
              
  <div id="color-holder" class="color-holder call-picker"></div>
  <button id="color-btn">Change color</button> 
  <input type="text" name="stroke_width" placeholder="4" id="stroke-width-picker" class="stroke_width_picker" />
  <button id="stroke-btn">Change stroke width</button>-->
                </div>
            </center>


        </div> 
        
        <!-- MAP AND STORY ITEMS -->
        
        <div class="box" style="position:absolute;top:0;">
            
            <div id="map"> </div>
            
            
            <div class="the-guide">When you are sure of your choice, please <em>remember</em> it.</div>
            <div class="the-question" style="display:;"></div>
            
            <div class="please"></div>
        </div>

        <div class="map-overlay" style="pointer-events: none;"></div>
        
        
        <!-- CANVAS -->
        

        <div class="box" id="paint" style="background:transparent;">

            <div class="words">

                <textarea id="my_words" placeholder="Tell a story.">
                  </textarea>
            </div>

            <div id="camera" class="camera">
                <div class="camera-overlay"></div>
            </div>



        </div>

        <div class="box" id="photo" style="min-height:100px;position: absolute;display:none;"></div>


    </div>


    <!-- SCRIPTS -->

    <!-- <script src="assets/js/test.js"></script>-->



    <script async defer src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAq7DNXbXovJQsc6InqHtJelNBuG7IekWo" type="text/javascript"></script>


    <script type="text/javascript">
        
        var standard_message = $('#my_words').val();
        $('#my_words').focus(
            function() {
                if ($(this).val() == standard_message)
                    $(this).val("");
                
                $(".the-question").fadeOut();
            }
        );
        $('#my_words').blur(
            function() {
                if ($(this).val() == "")
                    $(this).val(standard_message);
                
                $(".the-question").fadeIn("slow");
            }
        );
        
        
        
      $(function () {
        var socket = io();
          
        $('.remember').click(function(){
          socket.emit('message', $('#my_words').val());
            
          return false;
        });
        socket.on('message', function(msg){
            
            // delete random if more than n
            if($('div.please').length >= 12){
                
                let r = Math.floor(Math.random() * $('div.please').length);
                
                 $("div.please").eq(r).fadeOut(5000);
            }
            
            
            $(".please").first().clone().text(msg).css({
                left:  Math.floor( Math.random() * 1000 ),
                top:  Math.floor( Math.random() * 1000 ),   
            }).insertAfter(".please:last");
            
        });
      });
        
            $("#landing").click(function(){
                $("#landing").fadeOut().remove();
                
            
            var obj = document.createElement("audio");
                obj.src = "https://chia.dev/create/lettered/postcard.mp3"; 
                obj.play(); 
                

                /* INITIALIZE GAME HERE */

                 letters.initialize();
                
            });
            
     

        function autorun() {
            html2canvas(document.body).then(function(canvas) {
                document.body.appendChild(canvas);
            });
            
            /* LOAD BACKGROUND */
            
            // number of entries
            const r = Math.floor(Math.random() * 10);
            
            
            $("#landing").css({
                background: "url(https://chia.dev/create/lettered/intro-" + r + ".jpg)"
            });
            
            

        }
        if (window.addEventListener) window.addEventListener("load", autorun, false);
        else if (window.attachEvent) window.attachEvent("onload", autorun);
        else window.onload = autorun;

    </script>

    <!-- The core Firebase JS SDK is always required and must be listed first -->
    <script src="https://www.gstatic.com/firebasejs/7.5.2/firebase-app.js"></script>
    <script src="https://www.gstatic.com/firebasejs/7.5.2/firebase-database.js"></script>

    <!-- TODO: Add SDKs for Firebase products that you want to use
         https://firebase.google.com/docs/web/setup#available-libraries -->

    <script>
        // Your web app's Firebase configuration
        var firebaseConfig = {
            apiKey: "AIzaSyB6YpHvE5evb-fycvBrLylaYd2h905V0ug",
            authDomain: "lettered.firebaseapp.com",
            databaseURL: "https://lettered.firebaseio.com",
            projectId: "lettered",
            storageBucket: "lettered.appspot.com",
            messagingSenderId: "699344905467",
            appId: "1:699344905467:web:96f14a770898f0433dbc5e",
            measurementId: "G-VZ0ZBH58XL"
        };
        // Initialize Firebase
        firebase.initializeApp(firebaseConfig);
        console.log("Done");
        var database = firebase.database();

    </script>


</body>

</html>