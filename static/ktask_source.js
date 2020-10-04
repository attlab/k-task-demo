// this is used for browserify (not sure exactly what it does)
const { SSL_OP_SSLREF2_REUSE_CERT_TYPE_BUG } = require("constants");
// the npm module fabric is used for this class for better drawing
const fabric = require("fabric").fabric;
// the browserify CLI is used to ensure the module loads in the browser
// to use browserify, run 'browserify <source file> -o <target file>'
// and browserify will take the source file, bundle it with its packages,
// and create a file at target file that's ready to go
var params = new URLSearchParams(window.location.search)
participant_id = params.get('participant_id')
console.log(participant_id)

class KTask{
    constructor(fabric,participant_id){
        var w = window.innerWidth
        var h = window.innerHeight

        this.fabric = fabric
        this.participant_id = participant_id
        
        this.canvas = new fabric.StaticCanvas('canvas',{
            backgroundColor: 'grey',
            width: w/1.5, height: h/1.5,
        
        });
        
        this.canvas_center_x = this.canvas.width/2
        this.canvas_center_y = this.canvas.height/2        

    }

    run_exp(){
        this.started = false
        this.num_blocks = 5
        this.block_count = 1
        this.num_trials = 5
        this.trial_count = 1
        
        var self = this
        
        this.interval = setInterval( function(){ self.update(self) },1) 
        
        
    }

    draw_fixation(size){

        var line_x = new fabric.Line([0,0,size,0],{
            left: this.canvas_center_x - size/2,
            top: this.canvas_center_y,
            stroke: 'white'

        })

        var line_y = new fabric.Line([0,0,0,size],{
            left: this.canvas_center_x,
            top: this.canvas_center_y - size/2,
            stroke: 'white'

        })

        this.canvas.add(line_x)
        this.canvas.add(line_y)

        this.canvas.bringToFront(line_x)
        this.canvas.bringToFront(line_y)

    }

    new_square(x,y,size,color){
        if (x == 'center'){
            x = this.canvas_center_x
        }
        if (y == 'center'){
            y = this.canvas_center_y
        }
        var rect = new fabric.Rect({
            left: x - size/2,
            top: y - size/2,
            fill: color,
            width: size,
            height: size
        });

        this.rect = rect
        
        this.canvas.add(this.rect)

    }

    new_array(set_size){

        var size = 30   
        
        this.square_array = []

        this.x_array = []
        this.y_array = []
        this.r_array = []
        this.g_array = []
        this.b_array = []
        
        var i;
        for (i=0;i<set_size;i++){

            this.square_array.push(NaN)

            this.x_array.push((this.canvas.width - size) * Math.random())
            this.y_array.push((this.canvas.height - size) * Math.random())
            this.r_array.push(255 * Math.random())
            this.g_array.push(255 * Math.random())
            this.b_array.push(255 * Math.random())

        }

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

        if (self.started == false){

            if (this.block_count==1){
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


            }
            else {
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
            
            
            

            window.addEventListener('keypress',start,false)
            function start(){
                self.start_time = performance.now()
                window.removeEventListener('keypress',start)

                self.canvas.remove(instructions)
                self.started = true                

            }

        }

        if (self.started){            
            var current_time = performance.now()
            var elapsed_time = current_time - self.start_time
            this.round_time = Math.floor(10000*elapsed_time/10000)

        }
        
        var set_size = 6
        var change_at_range = 5

        // time is in ms
        // show stim for 1 sec
        var change_at = 500
        if (change_at-change_at_range < this.round_time && this.round_time < change_at+change_at_range){

            if (this.exp_stage != 'stim_pres'){
                this.new_array(set_size)
                this.draw_fixation(15)
                this.exp_stage = 'stim_pres'
                this.resp_given = false

            }

        }

        var change_at = 1500
        if (change_at-change_at_range < this.round_time && this.round_time < change_at+change_at_range){

            if (this.exp_stage != 'isi_2'){

                var i;
                for (i=0;i<set_size;i++){
                    this.square_array[i].set({ fill:this.canvas.backgroundColor })
                
                }
            
                this.canvas.renderAll()  
                this.exp_stage == 'isi_2'

            }
            
        }

        var change_at = 2000
        if (change_at-change_at_range < this.round_time && this.round_time < change_at+change_at_range){
            
            if (this.exp_stage != 'target'){

                var change = Math.random() < 0.2    // 20% chance each trail will be a change trial

                if (change){
                    this.square_array[0].set({ left:this.x_array[0], top:this.y_array[0], fill:`rgb(${255 * Math.random()},${255 * Math.random()},${255 * Math.random()}` })        
                    

                } else {
                    this.square_array[0].set({ left:this.x_array[0], top:this.y_array[0], fill:`rgb(${this.r_array[0]},${this.g_array[0]},${this.b_array[0]}` })        
                    
                }

                this.canvas.renderAll() 
                var target_shown = performance.now() 
                this.exp_stage = 'target'

                window.addEventListener('keypress',on_press,false)
                var block = this.block_count
                var trial = this.trial_count
                var resp_given = this.resp_given
                var participant_id = this.participant_id
                 
                function on_press(e){
                    if (resp_given == false){
                        var press = performance.now()
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
                        strokeWidth:1.5
                    })
                    message.set({ left:self.canvas_center_x - 150,top:self.canvas_center_y - 200 })
                    self.canvas.add(message)


                }

                this.exp_stage = 'end'

            }
            
        }
        
    }

}

ktask = new KTask(fabric,participant_id)
ktask.run_exp()

