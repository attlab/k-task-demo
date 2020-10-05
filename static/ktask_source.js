// this is used for browserify 
const { SSL_OP_SSLREF2_REUSE_CERT_TYPE_BUG } = require("constants");
// the npm module fabric is used for this class for better drawing
const fabric = require("fabric").fabric;
// the browserify CLI is used to ensure the module loads in the browser
// to use browserify, run 'browserify <source file> -o <target file>'
// and browserify will take the source file, bundle it with its packages,
// and create a file at target file that's ready to go

// this loads the participant id parameter specified at the home page
// and stores it as a variable 
var params = new URLSearchParams(window.location.search)
participant_id = params.get('participant_id')
console.log(participant_id)

class KTask{
    constructor(fabric,participant_id){
        // get the size of the window
        var w = window.innerWidth
        var h = window.innerHeight
        // pass fabric and participant id to the class so it can be used
        this.fabric = fabric
        this.participant_id = participant_id
        // create a new canvas to draw on
        this.canvas = new fabric.StaticCanvas('canvas',{
            backgroundColor: 'grey',
            width: w/1.5, height: h/1.5,
        
        });
        // store the center of the canvas for drawing new textures
        this.canvas_center_x = this.canvas.width/2
        this.canvas_center_y = this.canvas.height/2        

    }

    run_exp(){
        // start the experiment with some initial variables that will be changed throughout
        this.started = false
        this.num_blocks = 5
        this.block_count = 1
        this.num_trials = 5
        this.trial_count = 1
        // store 'this' (the class) as a variable so it can be used with anonymous functions
        var self = this
        this.interval = setInterval( function(){ self.update(self) },1) 
        
    }

    draw_fixation(size){
        // create a horizontal line
        var line_x = new fabric.Line([0,0,size,0],{
            left: this.canvas_center_x - size/2,
            top: this.canvas_center_y,
            stroke: 'white'

        })
        // create a vertical line
        var line_y = new fabric.Line([0,0,0,size],{
            left: this.canvas_center_x,
            top: this.canvas_center_y - size/2,
            stroke: 'white'

        })
        // add the lines to the canvas as a fixation point
        this.canvas.add(line_x)
        this.canvas.add(line_y)
        // bring the fixation point to the front of the canvas
        this.canvas.bringToFront(line_x)
        this.canvas.bringToFront(line_y)

    }

    new_array(set_size){
        // specify the size of the squares in the array
        var size = 30   
        // create an empty array to append squares to
        this.square_array = []
        // create empty arrays for attributes of the squares
        this.x_array = []
        this.y_array = []
        this.r_array = []
        this.g_array = []
        this.b_array = []
        // create the array of values
        var i;
        for (i=0;i<set_size;i++){
            this.square_array.push(NaN)
            this.x_array.push((this.canvas.width - size) * Math.random())
            this.y_array.push((this.canvas.height - size) * Math.random())
            this.r_array.push(255 * Math.random())
            this.g_array.push(255 * Math.random())
            this.b_array.push(255 * Math.random())

        }
        // create an array of squares with the specified values
        for (i=0;i<set_size;i++){
            this.square_array[i] = new fabric.Rect({
                left: this.x_array[i],
                top: this.y_array[i],
                fill: `rgb(${this.r_array[i]},${this.g_array[i]},${this.b_array[i]}`,
                width: size,
                height: size
            });
            this.canvas.add(this.square_array[i])
            
        }
        
    }

    update(self){
        // this function is used to time events during each trial
        if (self.started == false){
            if (this.block_count==1){
                // show the intructions for the experiment
                var instructions = new fabric.IText(`
                You are about to see an array of colored squares \n
                appear on the screen. The squares will pop up, \n
                go away, and then one of the squares will reappear. \n
                Press F if the square stays the same color \n 
                and J if it changes color. \n
                Press any key to begin.`,
                    {fill: 'white',
                    textAlign:'center',
                    fontSize:20,
                    fontFamily:'Calibri Light',
                    fontWeight:'normal'
                })
                instructions.set({ left:self.canvas_center_x - instructions.width/1.8,top:self.canvas_center_y - instructions.height/2 })
                self.canvas.add(instructions)

            } else {
                // show instructions inbetween breaks 
                var instructions = new fabric.IText(`
                This is a break. \n
                Press any key to continue.`,
                    {fill: 'white',
                    textAlign:'center',
                    fontSize:20,
                    fontFamily:'Calibri Light',
                    fontWeight:'normal'
                })
                instructions.set({ left:self.canvas_center_x - instructions.width/1.6,top:self.canvas_center_y - 150 })
                self.canvas.add(instructions)


            }            
            // listen for key press
            window.addEventListener('keypress',start,false)
            function start(){
                // start the timer
                self.start_time = performance.now()
                window.removeEventListener('keypress',start)
                self.canvas.remove(instructions)
                self.started = true                

            }

        }

        if (self.started){     
            // create a timer for the trial       
            var current_time = performance.now()
            var elapsed_time = current_time - self.start_time
            this.round_time = Math.floor(10000*elapsed_time/10000)

        }
        
        // set size for the stimulus array
        var set_size = 6
        // this refers to the spread of a range of values events will happen at
        var change_at_range = 5
        // the range, as opposed to a single value, is necessary because the browser
        // doesn't refresh fast enough to flip on a single millisecond. so this variable allows 
        // the flip to happen at a given value plus or minus 5 ms. 

        // time is in ms
        // show stim for 1 sec
        var change_at = 500
        if (change_at-change_at_range < this.round_time && this.round_time < change_at+change_at_range){
            if (this.exp_stage != 'stim_pres'){
                // the exp_stage variable ensures each change only happens once
                this.new_array(set_size)
                this.draw_fixation(15)
                this.exp_stage = 'stim_pres'
                this.resp_given = false

            }

        }

        var change_at = 1500
        if (change_at-change_at_range < this.round_time && this.round_time < change_at+change_at_range){
            if (this.exp_stage != 'isi_1'){
                // set the squares to the background color
                var i;
                for (i=0;i<set_size;i++){
                    this.square_array[i].set({ fill:this.canvas.backgroundColor })
                
                }
                this.canvas.renderAll()  
                this.exp_stage == 'isi_1'

            }
            
        }

        var change_at = 2000
        if (change_at-change_at_range < this.round_time && this.round_time < change_at+change_at_range){  
            if (this.exp_stage != 'target'){
                // 20% chance each trail will be a change trial
                var change = Math.random() < 0.2    
                if (change){
                    // on changes trials, set the square color to a new random color
                    this.square_array[0].set({ left:this.x_array[0], top:this.y_array[0], fill:`rgb(${255 * Math.random()},${255 * Math.random()},${255 * Math.random()}` })        
                    
                } else {
                    this.square_array[0].set({ left:this.x_array[0], top:this.y_array[0], fill:`rgb(${this.r_array[0]},${this.g_array[0]},${this.b_array[0]}` })        
                    
                }

                this.canvas.renderAll() 
                // this is a start value to calculate RT
                var target_shown = performance.now() 
                this.exp_stage = 'target'

                // listen for response
                window.addEventListener('keypress',on_press,false)
                // store class variables as variables to use in anonymous function
                var block = this.block_count
                var trial = this.trial_count
                var resp_given = this.resp_given
                var participant_id = this.participant_id
                 
                function on_press(e){
                    if (resp_given == false){
                        // get rt
                        var press = performance.now()
                        // set variables for data storage
                        var keyCode = e.keyCode
                        var trial_resp = NaN
                        var trial_acc = 0

                        if (keyCode == 102 || keyCode == 106){
                            if (keyCode == 102){
                                trial_resp = 'f'
                                if (!change){
                                    trial_acc=1
                                }

                            }

                            if (keyCode == 106){
                                trial_resp = 'j'
                                if (change){
                                    trial_acc=1
                                }

                            }

                            var trial_rt = press - target_shown
                            

                            if (trial_rt <= 1000){
                                // send data as AJAX request to /data
                                $.ajax({
                                    url: "./data",
                                    type: 'GET',
                                    data: { 
                                        participant_id : participant_id,
                                        block : block,
                                        trial : trial,
                                        trial_resp : trial_resp,
                                        trial_rt : trial_rt,
                                        trial_acc : trial_acc,
                                        change: change
                                    },
                                    success: function () {
                                        console.log("sent data");
                                    },
                                    error: function () {
                                        console.log();
                                    }
                                });

                                resp_given = true
                                console.log(participant_id)

                            } 
                            else {
                                trial_resp = 'N/A'
                                trial_rt = 0

                                $.ajax({
                                    url: "./data",
                                    type: 'GET',
                                    data: { 
                                        participant_id : participant_id,
                                        block : block,
                                        trial : trial,
                                        trial_resp : trial_resp,
                                        trial_rt : trial_rt,
                                        trial_acc : trial_acc,
                                        change: change
                                    },
                                    success: function () {
                                        console.log("sent data");
                                    },
                                    error: function () {
                                        console.log();
                                    }
                                });
                                
                                resp_given = true

                            }

                        }
                        
                    } 
                    
                }

                this.resp_given = resp_given

            }
            
        }

        // end trail
        var change_at = 3000
        if (change_at-change_at_range < this.round_time && this.round_time < change_at+change_at_range){
            if (this.exp_stage != 'end'){
                this.square_array[0].set({ fill:this.canvas.backgroundColor })
                this.canvas.renderAll()  

                if (this.trial_count <= this.num_trials){
                    this.trial_count += 1
                    this.start_time = performance.now()

                }
                if (this.trial_count == this.num_trials+1 && this.block_count < this.num_blocks){
                    this.trial_count = 1
                    this.block_count += 1
                    self.started = false

                }
                if (this.trial_count == this.num_trials+1 && this.block_count == this.num_blocks){
                    var message = new fabric.IText(`
                    All done! \n
                    Thank you for participating.`,
                        {fill: 'white',
                        textAlign:'center',
                        fontSize:20,
                        fontFamily:'Calibri Light',
                        fontWeight:'normal'
                    })
                    message.set({ left:self.canvas_center_x - 150,top:self.canvas_center_y - 200 })
                    self.canvas.add(message)


                }

                this.exp_stage = 'end'

            }
            
        }
        
    }

}

// create an instance of the experiment class
ktask = new KTask(fabric,participant_id)
// run the experiment
ktask.run_exp()

