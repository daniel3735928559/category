<template>
    <div class="simavr">
	<div class="simavr_programming" v-if="!running">
	    <div class="simavr_controls">
		<div v-bind:class="'simavr_button ' + (running == true ? 'simavr_disabled_button' : 'simavr_enabled_button')" v-on:click="program_pm()">run</div>
		<div v-bind:class="'simavr_button ' + (running == true ? 'simavr_disabled_button' : 'simavr_enabled_button')" v-on:click="reset_program()" v-if="reset_feature != 'no'">reset</div>
		<div class="simavr_status">Status: {{status}}</div>
	    </div><br />
	    <form><textarea v-bind:id="'simavr'+simid+'_program_area'"></textarea></form>
	    <br />
	</div>
	<div class="simavr_output_container" v-if="running">
	    <div class="simavr_controls">
		<div v-bind:class="'simavr_button ' + (running == false ? 'simavr_disabled_button' : 'simavr_enabled_button')" v-on:click="end()">end</div>
		<div style="margin-top:10px;display:inline-block;">
		    <select name="output_select" v-model="output_type.selection">
			<option value="program">View Program</option>
			<option value="simple">View Simple I/O</option>
			<!-- <option value="complex">View Complex I/O</option> -->
		    </select>
		</div>
	    </div>
	    <div class="simavr_output" v-if="output_type.selection == 'program'">
		<b>Program: </b>
		<pre>{{program}}</pre>
	    </div>
	    <div class="simavr_output" v-if="output_type.selection == 'simple'">
		Output LCD: <br />(Connected to pins 0-7 of D)<br />
		<div class="simavr_io_num">
		    {{truncate(PORTD,8,false)}}
		</div>

		<br /><br />

		Toggle switches--click to toggle:<br />(Connected to pins 0-7 of D): <br />
		<div style="display:inline-block;" v-for="i in [0,1,2,3,4,5,6,7]">
		    {{i}}:
		    <div v-bind:class="'simavr_io_switch ' + (io_state.switch_state[i] == 'ON' ? 'simavr_io_switch_on' : 'simavr_io_switch_off')" v-on:click="io_switch(i)">
			{{io_state.switch_state[i]}}
		    </div>
		    <br /><br />
		</div>
	    </div>
	    <div class="simavr_output" v-if="output_type.selection == 'complex'">
		Paceholder for full output panel
	    </div>
	</div>
	<div class="simavr_simulator" v-if="running">
	    <div class="simavr_controls">
		<div v-bind:class="'simavr_button ' + (running == false ? 'simavr_disabled_button' : 'simavr_enabled_button')" v-on:click="reset(false)">reset</div>
		<div v-bind:class="'simavr_button ' + (running == false ? 'simavr_disabled_button' : 'simavr_enabled_button')" v-on:click="step()">step</div>
		<input class="simavr_mem_start" type="number" v-model="steps.count" v-if="running == true"></input>
	    </div><br />
	    <div id="simavr_pm">
		<div class="simavr_title">PM at <input class="simavr_mem_start" type="number" v-model="display_pm_start"></input></div><br />
		<div class="simavr_display_button" v-on:click="set_PM_display_mode('t')">[text]</div>
		<div class="simavr_display_button" v-on:click="set_PM_display_mode('b')">[bin]</div>
		<div class="simavr_display_button" v-on:click="set_PM_display_mode('d')">[dec]</div>
		<div class="simavr_display_button" v-on:click="set_PM_display_mode('h')">[hex]</div>
		<div v-for="(i,idx) in PM.slice(display_pm_start,display_pm_start+display_pm_length)">
		    <div v-bind:class="'simavr_pm '+ (display_pm_start+idx == PC ? 'simavr_active' : 'simavr_normal')">
			<span class="simavr_label_long">{{display_pm_start+idx}}: </span>{{ PM[display_pm_start+idx].display() }}
		    </div>
		    <br />
		</div>
		<br />
	    </div>
	    <div id="simavr_rf">
		<div class="simavr_title">Register file</div><br />
		<div class="simavr_display_button" v-on:click="set_RF_display_mode('b')">[bin]</div>
		<div class="simavr_display_button" v-on:click="set_RF_display_mode('d')">[dec]</div>
		<div class="simavr_display_button" v-on:click="set_RF_display_mode('2')">[com]</div>
		<div class="simavr_display_button" v-on:click="set_RF_display_mode('h')">[hex]</div>
		<br />
		
		<span v-for="(r,idx) in RF"><div v-bind:class="'simavr_reg '+ (is_updated(idx) ? 'simavr_updated' : 'simavr_normal')"><span class="simavr_label">{{idx}}: </span>{{display_rf(idx)}}</div><br v-if="(idx)%2 == 1" /></span><br />
	    </div>
	    <div id="simavr_ram">
		<div class="simavr_title">RAM at <input class="simavr_mem_start" type="number" v-model="display_ram_start"></input></div><br />
		<div class="simavr_display_button" v-on:click="set_RAM_display_mode('d')">[dec]</div>
		<div class="simavr_display_button" v-on:click="set_RAM_display_mode('2')">[com]</div>
		<div class="simavr_display_button" v-on:click="set_RAM_display_mode('c')">[txt]</div>
		<div v-for="(i,idx) in RAM.slice(display_ram_start,display_ram_start+display_ram_length)">
		    <div v-bind:class="'simavr_ram '+ (is_ram_updated(display_ram_start+idx) ? 'simavr_updated' : 'simavr_normal')">
			<span class="simavr_label_long">{{display_ram_start+idx}}: </span>{{display_ram(display_ram_start+idx)}}
		    </div>
		    <br />
		</div>
		<br />
	    </div>
	    <div id="simavr_other">
		<div class="simavr_title">Other</div><br /><div class="simavr_display_button" v-on:click="">&nbsp;</div><br />
		<div v-bind:class="{simavr_reg:true, simavr_updated:is_updated('PC'), simavr_normal:!is_updated('PC')}"><span class="simavr_label">PC: </span>{{PC}}</div><br />
		<br />
		<div v-bind:class="'simavr_reg '+(is_updated('Z') ? 'simavr_updated' : 'simavr_normal')"><span class="simavr_label">Z: </span>{{Z}}</div><br />
		<div v-bind:class="'simavr_reg '+(is_updated('C') ? 'simavr_updated' : 'simavr_normal')"><span class="simavr_label">C: </span>{{C}}</div><br />
		<div v-bind:class="'simavr_reg '+(is_updated('N') ? 'simavr_updated' : 'simavr_normal')"><span class="simavr_label">N: </span>{{N}}</div><br />
		<br />
		
		<div v-bind:class="'simavr_reg '+(is_updated(26)||is_updated(27) ? 'simavr_updated' : 'simavr_normal')"><span class="simavr_label">X: </span>{{truncate(RF[26],8,false)+256*truncate(RF[27],8,false)}}</div><br />
		<div v-bind:class="'simavr_reg '+(is_updated(28)||is_updated(29) ? 'simavr_updated' : 'simavr_normal')"><span class="simavr_label">Y: </span>{{truncate(RF[28],8,false)+256*truncate(RF[29],8,false)}}</div><br />
		<div v-bind:class="'simavr_reg '+(is_updated(30)||is_updated(31) ? 'simavr_updated' : 'simavr_normal')"><span class="simavr_label">Z: </span>{{truncate(RF[30],8,false)+256*truncate(RF[31],8,false)}}</div><br />
		<br />
		
		<div v-bind:class="'simavr_reg '+(is_updated('PIND') ? 'simavr_updated' : 'simavr_normal')"><span class="simavr_label_long">PIND: </span>{{PIND}}</div><br />
		<div v-bind:class="'simavr_reg '+(is_updated('DDRD') ? 'simavr_updated' : 'simavr_normal')"><span class="simavr_label_long">DDRD: </span>{{DDRD}}</div><br />
		<div v-bind:class="'simavr_reg '+(is_updated('PORTD') ? 'simavr_updated' : 'simavr_normal')"><span class="simavr_label_long">PORTD: </span>{{PORTD}}</div><br />
		<div v-bind:class="'simavr_reg '+(is_updated('SPL') ? 'simavr_updated' : 'simavr_normal')"><span class="simavr_label_long">SPL: </span>{{SPL}}</div><br />
		<div v-bind:class="'simavr_reg '+(is_updated('SPH') ? 'simavr_updated' : 'simavr_normal')"><span class="simavr_label_long">SPH: </span>{{SPH}}</div>
	    </div>
	</div>
    </div>
</template>
<script>
 import CodeMirror from 'codemirror'
 export default {
     name: 'cat-jsavr',
     props: ['root','program','text','control','size','lightboard_feature','reset_feature','simid','debug_mode_feature'],
     data () {
	 return {
	     id: '',
	     rendered: '',
	     debug_log: this.do_nothing,
	     status: "Ready",
	     running: false,
	     outputs: [],
	     io_state: {'switch_state':["OFF","OFF","OFF","OFF","OFF","OFF","OFF","OFF"]},
	     steps: {'count':1},
	     output_type: {"selection":"program"},
	     symbols: {},
	     PM_display_mode: "t",
	     RAM_display_mode: "d",
	     RF_display_mode: "d",
	     RAM: [],
	     PM: [],
	     RF: [],
	     
	     PIND: 0,
	     PORTD: 0,
	     DDRD: 0,
	     SPH: 0,
	     SPL: 0,
	     
	     RAM_size: 65536,
	     PM_size: 65536,
	     RF_size: 32,
	     updated: [],
	     error_line: 0,
	     current_ram_data: [],
	     display_pm_start: 0,
	     display_ram_start: 0,
	     display_pm_length: 16,
	     display_ram_length: 16,
	     directives: {
		 "label":{"regex":/^([a-zA-Z_][a-zA-Z0-9_]*):$/,"process":function(args){
		     return {"symbol":args[1],
			     "symbol_type":"pm",
		     };
		 }},
		 "word":{"regex":/^\.word ([0-9,]+)$/,"process":function(args){
		     var rdata = args[1].split(",");
		     for(var i = 0; i < rdata.length; i++){
			 rdata[i] = this.truncate(parseInt(rdata[i]),16,false);
		     }
		     return {"symbol":args[1],
			     "symbol_type":"pm",
			     "pm_data":rdata
		     };
		 }},
		 "byte_ram":{"regex":/^ *\.byte\(([a-zA-Z_][a-zA-Z0-9_]*)\) ([-0-9, ]+) *$/,"process":function(args){
		     var rdata = args[2].split(",");
		     for(var i = 0; i < rdata.length; i++){
			 rdata[i] = this.truncate(parseInt(rdata[i].trim()),8,false);
		     }
		     return {"symbol":args[1],
			     "symbol_type":"ram",
			     "ram_data":rdata
		     };
		 }},
		 "string_ram":{"regex":/^ *\.string\(([a-zA-Z_][a-zA-Z0-9_]*)\) "((?:[^"\\]|\\.)*)" *$/,"process":function(args){
		     var str = this.handle_string_escapes(args[2]);
		     var rdata = []
		     for(var i = 0; i < str.length; i++){
			 rdata.push(this.truncate(str.charCodeAt(i),8,false));
		     }
		     rdata.push(0);
		     return {"symbol":args[1],
			     "symbol_type":"ram",
			     "ram_data":rdata
		     };
		     
		 }}
	     },
	     formats: {
		 "4r8i":{
		     "string":/ *r([0-9]+), *()(-?[a-zA-Z_0-9)(-]+|'..?') *$/,
		     "to_string":function(mnemonic,c,r,s,i){return mnemonic + " r" + r + ","+i;},
		     "binary":"CCCCIIIIRRRRIIII",
		     "i_bits":8,
		     "validator":function(c, r, s, i){return 16 <= r && r < 32 && -128 <= i && i < 256;}},
		 "5r5s":{
		     "string":/ *r([0-9]+), *r([0-9]+)() *$/,
		     "to_string":function(mnemonic,c,r,s,i){return mnemonic + " r" + r + ",r"+s;},
		     "binary":"CCCCCCSRRRRRSSSS",
		     "validator":function(c, r, s, i){return 0 <= r && r < 32 && 0 <= s && s < 32;}},
		 "6s5r":{
		     "string":/ *r([0-9]+), *([0-9]+)() *$/,
		     "to_string":function(mnemonic,c,r,s,i){return mnemonic + " r" + r + ","+s;},
		     "binary":"CCCCCSSRRRRRSSSS",
		     "validator":function(c, r, s, i){return 0 <= r && r < 32 && 0 <= s && s < 64;}},
		 "5r6s":{
		     "string":/ *([0-9]+), *r([0-9]+)() *$/,
		     "to_string":function(mnemonic,c,r,s,i){return mnemonic + " " + r + ",r"+s;},
		     "binary":"CCCCCSSRRRRRSSSS",
		     "validator":function(c, r, s, i){return 0 <= r && r < 64 && 0 <= s && s < 32;}},
		 "5r":{
		     "string":/ *r([0-9]+)()() *$/,
		     "to_string":function(mnemonic,c,r,s,i){return mnemonic + " r" + r;},
		     "binary":"CCCCCCCRRRRRCCCC",
		     "validator":function(c, r, s, i){return 0 <= r && r < 32;}},
		 "5rX":{
		     "string":/ *r([0-9]+)(), *(-[XYZ]|[XYZ]|[XYZ]\+) *$/,
		     "to_string":function(mnemonic,c,r,s,i,x){return mnemonic + " r" + r + ","+i},
		     "binary":"CCCXCCCRRRRRXXXX",
		     "validator":function(c, r, s, i){return 0 <= r && r < 32;}},
		 "X5r":{
		     "string":/ *(-[XYZ]|[XYZ]|[XYZ]\+), *r([0-9]+)() *$/,
		     "to_string":function(mnemonic,c,r,s,i,x){return mnemonic + " " + r + ",r"+s;},
		     "binary":"CCCXCCCRRRRRXXXX",
		     "validator":function(c, r, s, i){return 0 <= s && s < 32;}},
		 "12i":{
		     "string":/ *()()(-?[a-zA-Z_0-9)(]+) *$/,
		     "to_string":function(mnemonic,c,r,s,i){return mnemonic + " " + i;},
		     "binary":"CCCCIIIIIIIIIIII",
		     "i_bits":12,
		     "validator":function(c, r, s, i){return -2048 <= i && i < 2048;}},
		 "7i":{
		     "string":/ *()()(-?[a-zA-Z_0-9)(]+) *$/,
		     "to_string":function(mnemonic,c,r,s,i){return mnemonic + " " + i;},
		     "binary":"CCCCCCIIIIIIICCC",
		     "i_bits":7,
		     "validator":function(c, r, s, i){return -64 <= i && i < 64;}},
		 "n":{
		     "string":/ *()()() *$/,
		     "to_string":function(mnemonic,c,r,s,i){return mnemonic;},
		     "binary":"CCCCCCCCCCCCCCCC",
		     "validator":function(c, r, s, i){return true;}}
	     },
	     instructions: {
		 "ldi":{"format":"4r8i", "c": 14, "exec":function(c, r, s, i){
		     var emu = this.parent;
		     console.log('T',emu);
		     emu.RF[r] = emu.truncate(i,8,false);
		     emu.PC++;
		     emu.ram_updated = [];
		     emu.updated = [r,"PC"];}},
		 "mov":{"format":"5r5s", "c": 11, "exec":function(c, r, s, i){
		     var emu = this.parent;
		     emu.RF[r] = emu.RF[s];
		     emu.PC++;
		     emu.ram_updated = [];
		     emu.updated = [r,"PC"];}},
		 "add":{"format":"5r5s", "c": 3, "exec":function(c, r, s, i){
		     var emu = this.parent;
		     emu.update_sreg(emu.RF[r] + emu.RF[s], true, true, true);
		     emu.RF[r] = emu.truncate(emu.RF[r] + emu.RF[s],8,false);
		     emu.PC++;
		     emu.ram_updated = [];
		     emu.updated = [r, "PC", "Z", "C", "N"];}},
		 "adc":{"format":"5r5s", "c": 7, "exec":function(c, r, s, i){
		     var emu = this.parent;
		     var oldC = emu.C;
		     emu.update_sreg(emu.RF[r] + emu.RF[s] + oldC, true, true, true);
		     emu.RF[r] = emu.truncate(emu.RF[r] + emu.RF[s] + oldC,8,false);
		     emu.PC++;
		     emu.ram_updated = [];
		     emu.updated = [r, "PC", "Z", "C", "N"];}},
		 "sbc":{"format":"5r5s", "c": 2, "exec":function(c, r, s, i){
		     var emu = this.parent;
		     var oldC = emu.C;
		     emu.update_sreg(emu.RF[r] - emu.RF[s] - oldC, true, true, true);
		     emu.RF[r] = emu.truncate(emu.RF[r] - emu.RF[s] - oldC,8,false);
		     emu.PC++;
		     emu.ram_updated = [];
		     emu.updated = [r, "PC", "Z", "C", "N"];}},
		 "sub":{"format":"5r5s", "c": 6, "exec":function(c, r, s, i){
		     var emu = this.parent;
		     emu.update_sreg(emu.RF[r] - emu.RF[s], true, true, true);
		     emu.RF[r] = emu.truncate(emu.RF[r] - emu.RF[s],8,false);
		     emu.PC++;
		     emu.ram_updated = [];
		     emu.updated = [r, "PC", "Z", "C", "N"];}},
		 "cp":{"format":"5r5s", "c": 5, "exec":function(c, r, s, i){
		     var emu = this.parent;
		     emu.update_sreg(emu.RF[r] - emu.RF[s], true, true, true);
		     emu.C = emu.truncate(emu.RF[r],8,true) < emu.truncate(emu.RF[s],8,true) ? 1 : 0; // HACK TO MATCH PRESENTATION
		     emu.PC++;
		     emu.ram_updated = [];
		     emu.updated = ["PC", "Z", "C", "N"];}},
		 "and":{"format":"5r5s", "c": 8, "exec":function(c, r, s, i){
		     var emu = this.parent;
		     emu.update_sreg(emu.RF[r] & emu.RF[s], true, false, true);
		     emu.RF[r] = emu.truncate(emu.RF[r] & emu.RF[s],8,false);
		     emu.PC++;
		     emu.ram_updated = [];
		     emu.updated = [r, "PC", "Z", "C", "N"];}},
		 "or":{"format":"5r5s", "c": 10, "exec":function(c, r, s, i){
		     var emu = this.parent;
		     emu.update_sreg(emu.RF[r] | emu.RF[s], true, false, true);
		     emu.RF[r] = emu.truncate(emu.RF[r] | emu.RF[s],8,false);
		     emu.PC++;
		     emu.ram_updated = [];
		     emu.updated = [r, "PC", "Z", "C", "N"];}},
		 "eor":{"format":"5r5s", "c": 9, "exec":function(c, r, s, i){
		     var emu = this.parent;
		     emu.update_sreg(emu.RF[r] ^ emu.RF[s], true, false, true);
		     emu.RF[r] = emu.truncate(emu.RF[r] ^ emu.RF[s],8,false);
		     emu.PC++;
		     emu.ram_updated = [];
		     emu.updated = [r, "PC", "Z", "C", "N"];}},
		 "cpi":{"format":"4r8i", "c": 3, "exec":function(c, r, s, i){
		     var emu = this.parent;
		     emu.update_sreg(emu.RF[r] - i, true, true, true);
		     emu.PC++;
		     emu.ram_updated = [];
		     emu.updated = ["PC","Z","C","N"];}},
		 "subi":{"format":"4r8i", "c": 5, "exec":function(c, r, s, i){
		     var emu = this.parent;
		     emu.update_sreg(emu.RF[r] - i, true, true, true);
		     emu.RF[r] = emu.truncate(emu.RF[r] - i,8,false);
		     emu.PC++;
		     emu.ram_updated = [];
		     emu.updated = ["PC","Z","C","N"];}},
		 "andi":{"format":"4r8i", "c": 7, "exec":function(c, r, s, i){
		     var emu = this.parent;
		     emu.update_sreg(emu.RF[r] & i, true, false, true);
		     emu.RF[r] = emu.truncate(emu.RF[r] & i,8,false);
		     emu.PC++;
		     emu.ram_updated = [];
		     emu.updated = ["PC","Z","C","N"];}},
		 "ori":{"format":"4r8i", "c": 6, "exec":function(c, r, s, i){
		     var emu = this.parent;
		     emu.update_sreg(emu.RF[r] | i, true, false, true);
		     emu.RF[r] = emu.truncate(emu.RF[r] | i,8,false);
		     emu.PC++;
		     emu.ram_updated = [];
		     emu.updated = ["PC","Z","C","N"];}},
		 "dec":{"format":"5r", "c": 1194, "exec":function(c, r, s, i){
		     var emu = this.parent;
		     emu.update_sreg(emu.RF[r] - 1, true, false, true);
		     emu.RF[r] = emu.truncate(emu.RF[r] - 1,8,false);
		     emu.PC++;
		     emu.ram_updated = [];
		     emu.updated = [r,"PC"];}},
		 "inc":{"format":"5r", "c": 1187, "exec":function(c, r, s, i){
		     var emu = this.parent;
		     emu.update_sreg(emu.RF[r] + 1, true, false, true);
		     emu.RF[r] = emu.truncate(emu.RF[r] + 1,8,false);
		     emu.PC++;
		     emu.ram_updated = [];
		     emu.updated = [r,"PC"];}},
		 "neg":{"format":"5r", "c": 1185, "exec":function(c, r, s, i){
		     var emu = this.parent;
		     emu.update_sreg(-emu.RF[r], true, true, true);
		     emu.RF[r] = emu.truncate(-emu.RF[r],8,false);
		     emu.PC++;
		     emu.ram_updated = [];
		     emu.updated = [r,"PC"];}},
		 "com":{"format":"5r", "c": 1184, "exec":function(c, r, s, i){
		     var emu = this.parent;
		     emu.update_sreg(~(emu.RF[r]), true, false, true);
		     emu.RF[r] = emu.truncate(~(emu.RF[r]),8,false);
		     emu.PC++;
		     emu.ram_updated = [];
		     emu.updated = [r,"PC"];}},
		 "ld":{"format":"5rX", "c": 32, "exec":function(c, r, s, i){
		     var emu = this.parent;
		     var reg = 0;
		     if(i == "X" || i == "-X" || i == "X+") reg = 26;
		     if(i == "Y" || i == "-Y" || i == "Y+") reg = 28;
		     if(i == "Z" || i == "-Z" || i == "Z+") reg = 30;
		     if(i[0] == "-"){
			 emu.updated.push(reg);
			 emu.dec_ptr(reg);
		     }
		     var ptr = emu.truncate(emu.RF[reg],8,false)+256*emu.truncate(emu.RF[reg+1],8,false);
		     emu.updated = [r,"PC"];
		     emu.RF[r] = emu.truncate(emu.RAM[ptr],8,false);
		     if(i[1] == "+"){
			 emu.updated.push(reg);
			 emu.inc_ptr(reg);
		     }
		     emu.ram_updated = [];
		     emu.PC++;}},
		 "st":{"format":"X5r", "c": 33, "exec":function(c, r, s, i){
		     var emu = this.parent;
		     i = r;
		     r = s;
		     var reg = 0;
		     if(i == "X" || i == "-X" || i == "X+") reg = 26;
		     if(i == "Y" || i == "-Y" || i == "Y+") reg = 28;
		     if(i == "Z" || i == "-Z" || i == "Z+") reg = 30;
		     if(i[0] == "-"){
			 emu.updated.push(reg);
			 emu.dec_ptr(reg);
		     }
		     var ptr = emu.truncate(emu.RF[reg],8,false)+256*emu.truncate(emu.RF[reg+1],8,false);
		     emu.updated = ["PC"];
		     emu.ram_updated = [ptr];
		     emu.RAM[ptr] = emu.RF[r];
		     emu.PC++;
		     if(i[1] == "+"){
			 emu.updated.push(reg);
			 emu.inc_ptr(reg);
		     }
		 }},
		 "rjmp":{"format":"12i", "c": 12, "exec":function(c, r, s, i){
		     var emu = this.parent;
		     emu.PC = emu.truncate(emu.PC + i + 1,16,false);
		     emu.ram_updated = [];
		     emu.updated = ["PC"];}},
		 "breq":{"format":"7i", "c": 481, "exec":function(c, r, s, i){
		     var emu = this.parent;
		     emu.PC = emu.truncate(emu.PC + 1 + (emu.Z == 1 ? (i <= 64 ? i : i-128) : 0),16,false);
		     emu.ram_updated = [];
		     emu.updated = ["PC"];}},
		 "brne":{"format":"7i", "c": 489, "exec":function(c, r, s, i){
		     var emu = this.parent;
		     emu.PC = emu.truncate(emu.PC + 1 + (emu.Z == 0 ? (i <= 64 ? i : i-128) : 0),16,false);
		     emu.ram_updated = [];
		     emu.updated = ["PC"];}},
		 "brsh":{"format":"7i", "c": 488, "exec":function(c, r, s, i){
		     var emu = this.parent;
		     emu.PC = emu.truncate(emu.PC + 1 + (emu.C == 0 ? (i <= 64 ? i : i-128) : 0),16,false);
		     emu.ram_updated = [];
		     emu.updated = ["PC"];}},
		 "brlo":{"format":"7i", "c": 480, "exec":function(c, r, s, i){
		     var emu = this.parent;
		     emu.PC = emu.truncate(emu.PC + 1 + (emu.C == 1 ? (i <= 64 ? i : i-128) : 0),16,false);
		     emu.ram_updated = [];
		     emu.updated = ["PC"];}},
		 "in":{"format":"6s5r", "c": 22, "exec":function(c, r, s, i){
		     var emu = this.parent;
		     emu.RF[r] = emu.truncate(emu.read_IO(s),8,false);
		     emu.PC++;
		     emu.ram_updated = [];
		     emu.updated = [r,"PC"];}},
		 "out":{"format":"5r6s", "c": 23, "exec":function(c, r, s, i){
		     var emu = this.parent;
		     i = s;
		     s = r;
		     r = i;
		     emu.write_IO(s,emu.RF[r]);
		     emu.PC++;
		     emu.ram_updated = [];
		     emu.updated = ["PC"];}},
		 "asr":{"format":"5r", "c": 1189, "exec":function(c, r, s, i){
		     var emu = this.parent;
		     var C = emu.RF[r]%2 == 0 ? 0 : 1;
		     emu.RF[r] = emu.truncate(emu.truncate(emu.RF[r],8,true) >> 1,8,false);
		     emu.update_sreg(emu.RF[r], true, false, true);
		     emu.C = C;
		     emu.PC++;
		     emu.ram_updated = [];
		     emu.updated = [r,"PC"];}},
		 "push":{"format":"5r", "c": 1183, "exec":function(c, r, s, i){
		     var emu = this.parent;
		     var SP = emu.SPH * 256 + emu.SPL;
		     emu.RAM[SP] = emu.RF[r];
		     emu.decSP();
		     emu.PC++;
		     emu.updated = ["PC","SPH","SPL"];
		     emu.ram_updated = [SP];}},
		 "pop":{"format":"5r", "c": 1167, "exec":function(c, r, s, i){
		     var emu = this.parent;
		     emu.incSP();
		     var SP = emu.SPH * 256 + emu.SPL;
		     emu.RF[r] = emu.truncate(emu.RAM[SP],8,false);
		     emu.PC++;
		     emu.ram_updated = [];
		     emu.updated = ["PC","SPH","SPL"];}},
		 "rcall":{"format":"12i", "c": 13, "exec":function(c, r, s, i){
		     var emu = this.parent;
		     emu.PC++;
		     var PCL = emu.PC % 256;
		     var PCH = Math.floor(emu.PC / 256);
		     var SP = emu.SPH * 256 + emu.SPL;
		     emu.RAM[SP] = PCH;
		     emu.decSP();
		     var SP = emu.SPH * 256 + emu.SPL;
		     emu.RAM[SP] = PCL;
		     emu.decSP();
		     emu.PC = emu.truncate(emu.PC + i,16,false);
		     emu.updated = ["PC","SPH","SPL"];
		     emu.ram_updated = [SP];}},
		 "ret":{"format":"n", "c": 38152, "exec":function(c, r, s, i){
		     var emu = this.parent;
		     emu.incSP();
		     var SP = emu.SPH * 256 + emu.SPL;
		     var PCL = emu.RAM[SP];
		     emu.incSP();
		     var SP = emu.SPH * 256 + emu.SPL;
		     var PCH = emu.RAM[SP];
		     emu.PC = PCL + 256*PCH;
		     emu.ram_updated = [];
		     emu.updated = ["PC","SPH","SPL"];}},
		 "nop":{"format":"n", "c": 0, "exec":function(c, r, s, i){
		     var emu = this.parent;
		     emu.PC++;
		     emu.ram_updated = [];
		     emu.updated = ["PC"];}},
		 "halt":{"format":"n", "c": 1, "exec":function(c, r, s, i){
		     var emu = this.parent;
		     emu.end();}}
	     }
	 }
     },
     methods: {
	 smul: function(str, num) {
	     var acc = [];
	     for (var i = 0; (1 << i) <= num; i++) {
		 if ((1 << i) & num)
		     acc.push(str);
		 str += str;
	     }
	     return acc.join("");
	 },
	 do_nothing: function(a){},
	 cm_setup: function(){
	     var sim_textarea = document.getElementById("simavr"+this.simid+"_program_area");
	     this.debug_log(this.simid,sim_textarea);
	     if(sim_textarea == null) return;
	     this.editor = CodeMirror.fromTextArea(sim_textarea, {
		 lineNumbers: true,
		 gutters: ["breakpoints", "CodeMirror-linenumbers"]
	     });
	     if(this.size){
		 if(this.size == "auto"){
		     this.editor.setSize(null, (this.program.split("\n").length + 2)*(this.editor.defaultTextHeight()) + 10);
		 }
		 else{
		     this.editor.setSize(null, this.size);
		 }
	     }
	     else{
		 this.editor.setSize(null, "70%");
	     }
	     this.editor.setOption("extraKeys", {
		 'Ctrl-Enter': function(cm) {
                     this.program_pm();
                     this.$apply();
		 }
	     });
	     this.editor.setValue(this.program);
	 },
	 reset_program: function(){
	     if(this.running) return;
	     if(this.text){
		 this.debug_log("Using text");
		 this.program = this.text;
	     }
	     else if(this.original_program){
		 this.program = this.original_program;
	     }
	     this.change_program(this.program);
	 },
	 reset: function(pm_reset){
	     this.io_state.switch_state = ["OFF","OFF","OFF","OFF","OFF","OFF","OFF","OFF"];
	     this.output_type.selection = "program";
	     this.display_pm_start = 0;
	     this.display_ram_start = 0;
	     this.steps = {'count':1};
	     this.PC = 0;
	     this.Z = 0;
	     this.C = 0;
	     this.N = 0;
	     this.PIND = 0;
	     this.PORTD = 0;
	     this.DDRD = 0;
	     this.SPH = 0;
	     this.SPL = 0;
	     this.updated = [];
	     this.ram_updated = [];
	     this.outputs = [];
	     this.mux = new this.output_mux();
	     for(var i = 0; i < this.RF_size; i++) this.RF[i] = 0;
	     for(var i = 0; i < this.RAM_size; i++) this.RAM[i] = 0;
	     for(var i = 0; i < this.IORF_size; i++) this.IORF[i] = 0;
	     var nop = this.parse("nop",0);
	     if(pm_reset){ for(var i = 0; i < this.PM_size; i++){ nop.addr = i; this.PM[i] = nop; }}
	     if(!pm_reset){ for(var i = 0; i < this.current_ram_data.length; i++) this.RAM[i+1024] = this.current_ram_data[i]; }
	     if(this.editor) this.editor.removeLineClass(this.error_line, "background", "active_line");
	 },
	 change_program: function(prog){
	     this.program = prog;
	     if(this.editor) this.editor.setValue(prog);
	 },
	 display_ram: function(i){
	     if(this.RAM_display_mode == "d"){
		 return this.RAM[i];
	     }
	     else if(this.RAM_display_mode == "2"){
		 return this.truncate(this.RAM[i],8,true);
	     }
	     else if(this.RAM_display_mode == "c"){
		 return String.fromCharCode(this.RAM[i])
	     }
	 },
	 display_rf: function(i){
	     if(this.RF_display_mode == "d"){
		 return this.truncate(this.RF[i],8,false);
	     }
	     if(this.RF_display_mode == "2"){
		 return this.truncate(this.RF[i],8,true);
	     }
	     else if(this.RF_display_mode == "b"){
		 var s = this.RF[i].toString(2);
		 return smul("0",8-s.length)+s;
	     }
	     else if(this.RF_display_mode == "h"){
		 var s = this.RF[i].toString(16);
		 return "0x"+smul("0",2-s.length)+s;
	     }
	 },
	 program_pm: function(){
	     if(this.running) return;
	     this.reset(true);
	     this.running = true;
	     this.program = this.editor.getValue();
	     var pm_data = this.preparse(this.program);
	     if(!pm_data){
		 this.running = false;
		 return;
	     }
	     var pm_addr = 0;
	     for(var i = 0; i < pm_data.length; i++){
		 var datum = pm_data[i];
		 if(datum.inst){
		     var inst = this.parse(datum.inst,pm_addr);
		     if(!inst) continue;
		     if(inst.error){
			 this.error_on_line(datum.line, inst.error);
			 return;
		     }
		     this.PM[pm_addr] = inst;
		     pm_addr++;
		 }
		 else if(datum.word){
		     var inst = this.decode(datum.word,pm_addr);
		     if(inst.error){
			 this.error_on_line(datum.line, inst.error);
			 return;
		     }
		     this.PM[pm_addr] = inst;
		     pm_addr++;
		 }
	     }
	     this.status = "Ready";
	 },
	 error_on_line: function(linenum, err_msg){
	     this.running = false;
	     this.status = "Error on line " + linenum + ": " + err_msg;
	     this.error_line = linenum;
	     if(this.editor) this.editor.addLineClass(linenum, "background", "active_line");
	 },
	 preparse: function(){
	     var lines = this.program.split("\n");
	     var to_program = [];
	     var pm_offset = 0;
	     var ram_offset = 1024;
	     for(var i = 0; i < lines.length; i++){
		 var pieces = lines[i].match(/^((?:[^";]|';'|"(?:[^\\"]+|\\(?:\\\\)*[nt\\"])*")*)(;.*)?$/)
		 this.debug_log("P",pieces);
		 if(!pieces){
		     this.error_on_line(i, "Invalid line: "+i);
		     return;
		 }
		 if(!pieces[1]) continue;
		 lines[i] = pieces[1].trim();
		 var is_inst = true;
		 for(var d in this.directives){
		     var matches = lines[i].match(this.directives[d].regex)
		     this.debug_log("D",lines[i],d,matches);
		     if(matches){
			 // process needs to return:
			 // - What it inserts to PM (pm_data)
			 // - What it inserts into RAM (ram_data)
			 // - What symbol it wants to make (symbol)
			 // - What kind of symbol it is (symbol_type == "pm" | "ram")
			 // - Whether there was an error (error)
			 
			 var result = this.directives[d].process(matches);

			 // Handle error
			 if(result.error){
			     this.error_on_line(i, result.error);
			     return;
			 }

			 // Update symbol
			 if(result.symbol && result.symbol_type){
			     if(result.symbol_type == "pm"){
				 this.symbols[result.symbol] = pm_offset;
			     }
			     else if(result.symbol_type == "ram"){
				 this.symbols[result.symbol] = ram_offset;
			     }
			 }
			 
			 // Insert data and update offsets
			 if(result.pm_data){
			     for(var j = 0; j < result.pm_data.length; j++){
				 to_program.push({'word':result.pm_data[j],'line':i});
			     }
			     pm_offset += result.pm_data.length;
			 }
			 if(result.ram_data){
			     for(var j = 0; j < result.ram_data.length; j++){
				 this.RAM[ram_offset + j] = result.ram_data[j];
			     }
			     this.current_ram_data = this.current_ram_data.concat(result.ram_data);
			     ram_offset += result.ram_data.length;
			 }
			 is_inst = false;
			 break;
		     }
		 }
		 if(is_inst && !(/^[ \t]*$/.test(lines[i]))){
		     to_program.push({'inst':lines[i],'line':i});
		     pm_offset++;
		 }
	     }
	     return to_program;
	 },
	 parse: function(inst,addr){
	     this.debug_log(inst)
	     var matches = inst.match(/^[ \t]*([a-zA-Z]+)[ \t]*((?:[^;]|';')*)[ \t]*$/)
	     if(!matches){
		 return {"error":"Line does not match any directive or instruction"};
	     }
	     var mnemonic = matches[1];
	     var operand = matches[2];
	     this.debug_log(mnemonic, "|||", operand);
	     if(mnemonic in this.instructions){
		 var format = this.instructions[mnemonic].format;
		 var execf = this.instructions[mnemonic].exec;
		 var ops = operand.match(this.formats[format].string);
		 if(!ops){
		     return {"error":"Operands to instruction " + inst + " did not parse"};
		 }
		 for(var i = 0; i < 3; i++){
		     if(/^[0-9]+$/.test(ops[i])) ops[i] = parseInt(ops[i]);
		     //else if(format.sym_valid[i]) ops[i] = symbols[ops[i]];
		 }
		 var opcode = this.instructions[mnemonic].c;
		 this.debug_log(format, execf, ops, opcode);
		 var data = {"r":ops[1],"s":ops[2],"i":ops[3],"c":opcode};
		 var new_inst = new this.instruction(mnemonic + " " + operand, mnemonic, data, execf,addr, this);
		 if(new_inst.error){
		     return {"error":inst.error};
		 }
		 if(new_inst.check_valid()){
		     return new_inst;
		 }
		 else{
		     return {"error":"Illegal operands to instruction " + inst};
		 }
	     }
	     else{
		 return {"error":"Invalid instruction " + inst};
	     }
	     return null;
	 },
	 is_updated: function(x){
	     for(var i = 0; i < this.updated.length; i++){
		 if(this.updated[i] == x) return true;
	     }
	     return false;
	 },
	 is_ram_updated: function(x){
	     for(var i = 0; i < this.updated.length; i++){
		 if(this.ram_updated[i] == x) return true;
	     }
	     return false;
	 },
	 handle_string_escapes: function(s){
	     s = s.replace(/(([^\\]|)(\\\\)*)\\t/g,"$1\t");
	     s = s.replace(/(([^\\]|)(\\\\)*)\\n/g,"$1\n");
	     s = s.replace(/(([^\\]|)(\\\\)*)\\"/g,"$1\"");
	     s = s.replace(/\\\\/g,"\\");
	     return s;
	 },

	 // X,*:  111
	 // Y,"": 010
	 // Y,+-" 110
	 // Z,"": 000
	 // Z,+-: 100
	 // "":  00
	 // "+": 01
	 // "-": 10
	 encode_x: function(i){
	     var x = 0;
	     var ptr = i[0] == "-" ? i[1] : i[0];
	     var mod = i[0] == "-" ? "-" : (i[1] == "+" ? "+" : "");
	     if(ptr == "X") x = 7*4
	     if(ptr == "Y") x = 6*4
	     if(ptr == "Z") x = 4*4
	     if(ptr != "X" && mod == "") x -= 16;
	     if(mod == "+") x += 1;
	     if(mod == "-") x += 2;
	     return x;
	 },
	 decode_x: function(x){
	     var ptr = "";
	     var mod = "";
	     this.debug_log("XX",x,x&3,(x>>2)&3)
	     if(((x >> 2)&3) == 3) ptr = "X";
	     if(((x >> 2)&3) == 2) ptr = "Y";
	     if(((x >> 2)&3) == 0) ptr = "Z";
	     if((x&3) == 1) mod = "+";
	     if((x&3) == 2) mod = "-";
	     this.debug_log("X=",mod,ptr)
	     return mod == "-" ? mod +""+ ptr : ptr +""+ mod;
	 },
	 encode: function(format, c, r, s, i){
	     var fmt = this.formats[format].binary;
	     var inst = 0;
	     var x = 0;
	     if(format == "5r6s"){
		 i = s;
		 s = r;
		 r = i;
	     }
	     else if(format == "5rX" || format == "X5r"){
		 if(format == "X5r"){
		     i = r;
		     r = s;
		 }
		 this.debug_log("Xe",i);
		 x = this.encode_x(i);
		 this.debug_log("Xd",x);
	     }
	     for(var j = 15; j >= 0; j--) {
		 if(fmt[j] == "C"){
		     inst += (c%2)<<(15-j);
		     c >>= 1;
		 }
		 if(fmt[j] == "R"){
		     inst += (r%2)<<(15-j);
		     r >>= 1;
		 }
		 if(fmt[j] == "S"){
		     inst += (s%2)<<(15-j);
		     s >>= 1;
		 }
		 if(fmt[j] == "I"){
		     inst += (i%2)<<(15-j);
		     i >>= 1;
		 }
		 if(fmt[j] == "X"){
		     inst += (x%2)<<(15-j);
		     x >>= 1;
		 }
	     }
	     return inst;
	 },
	 decode: function(x,addr){
	     for(var f in this.formats){
		 fmt = this.formats[f];
		 var data = {"c":0,"r":0,"s":0,"i":0,"x":0}
		 for(var j = 15; j >= 0; j--){
		     //this.debug_log("J",j,fmt.binary[15-j],(x>>j)%2);
		     if(fmt.binary[15-j] == "C") data.c = (data.c * 2) + ((x >> j) % 2);
		     if(fmt.binary[15-j] == "R") data.r = (data.r * 2) + ((x >> j) % 2);
		     if(fmt.binary[15-j] == "S") data.s = (data.s * 2) + ((x >> j) % 2);
		     if(fmt.binary[15-j] == "I") data.i = (data.i * 2) + ((x >> j) % 2);
		     if(fmt.binary[15-j] == "X") data.x = (data.x * 2) + ((x >> j) % 2);
		 }
		 if(f == "4r8i") data.r += 16;
		 if(f == "12i") data.i = this.truncate(data.i,12,true);
		 if(f == "7i") data.i = this.truncate(data.i,7,true);
		 if(f == "5rX") data.i = this.decode_x(data.x);
		 if(f == "X5r"){
		     data.s = data.r;
		     data.r = this.decode_x(data.x);
		 }
		 if(f == "5r6s"){
		     var temp = data.r;
		     data.r = data.s;
		     data.s = temp;
		 }
		 for(var mnemonic in this.instructions){
		     inst = this.instructions[mnemonic];
		     if(inst.format == f && inst.c == data.c){
			 return new this.instruction(x,mnemonic,data,inst.exec,addr,this);
		     }
		 }
	     }
	     return {"error":"Could not decode instruction: " + x};
	 },
	 label: function(name, addr){
	     this.label = true;
	     this.name = name;
	     this.addr = addr;
	 },
	 output_mux: function(){
	     this.SEL_ADDR = 0;
	     this.SEL_LEN = 255;
	     this.LCD_OUT = 1;
	     this.LB_OUT = 2;
	     this.target = 0;
	     this.len = 0;
	     this.state = 0;
	     this.input = function(val){
		 if(this.state == this.SEL_ADDR) {
		     this.target = val;
		     this.state = this.SEL_LEN;
		 }
		 else if(this.state == this.SEL_LEN){
		     this.len = val;
		     this.state = this.target;
		     this.target = 0;
		 }
		 else if(this.len > 0){
		     if(this.state-1 < this.output_devs.length)
			 this.output_devs.input(val);
		     this.len--;
		 }
		 else{
		     this.state = this.SEL_ADDR;
		 }
	     }
	 },
	 lcd: function(){
	     this.input = function(val){
		 
	     }
	 },
	 set_PM_display_mode: function(m){
	     this.PM_display_mode = m;
	 },
	 set_RAM_display_mode: function(m){
	     this.RAM_display_mode = m;
	 },
	 set_RF_display_mode: function(m){
	     this.RF_display_mode = m;
	 },
	 instruction: function(text, mnemonic, data, exec, addr, parent){
	     console.log(this);
	     this.parent = parent;
	     this.label = false;
	     this.addr = addr;
	     this.text = text;
	     this.c = data.c;
	     this.r = data.r;
	     this.s = data.s;
	     this.i = data.i;
	     this.exec = exec;
	     this.mnemonic = mnemonic;
	     console.log(this.text, this.c, this.r, this.s, this.i, this.mnemonic);
	     this.format = this.parent.instructions[this.mnemonic].format;
	     if(this.i.match){
		 var matches = this.i.match(/(lo|hi)8\(([a-zA-Z_][a-zA-Z0-9_]*)\)/);
		 if(matches){
		     if(matches[2] in this.parent.symbols){
			 if(matches[1] == "lo") this.i = this.parent.truncate(this.parent.symbols[matches[2]],8,false);
			 if(matches[1] == "hi") this.i = this.parent.truncate(this.parent.symbols[matches[2]]>>8,8,false);
		     }
		     else{
			 this.error = "Symbol not found " + matches[2];
		     }
		 }
		 else if(this.i in this.parent.symbols){
		     this.i = this.parent.symbols[this.i];
		     var fmt = this.parent.formats[this.format];
		     //this.parent.debug_log(this.parent.symbols,fmt.i_bits);
		     if(fmt.i_bits){
			 this.i = this.parent.truncate(this.i - this.addr - 1,fmt.i_bits,true);
		     }
		 }
		 else if(/'[^'\\]'/.test(this.i)){
		     this.i = this.i.charCodeAt(1);
		 }
		 else if(this.i == "'\\''"){
		     this.i = this.i.charCodeAt(2);
		 }
		 else if(this.i == "'\\\\'"){
		     this.i = this.i.charCodeAt(2);
		 }
		 else if(this.i == "'\\n'"){
		     this.i = 10;
		 }
		 else if(this.i == "'\\t'"){
		     this.i = 9;
		 }
		 else if(/^[XYZ]$|^[XYZ]\+$|^-[XYZ]$/.test(this.i)){
		     this.i = this.i;
		 }
		 else this.i = parseInt(this.i);
	     }
	     this.encoding = this.parent.encode(this.format, this.c, this.r, this.s, this.i < 0 ? this.parent.truncate(this.i,this.parent.formats[this.format].i_bits,false) : this.i);
	     //this.debug_log(this.text, this.c, this.r, this.s, this.i, this.mnemonic);
	     var self = this;
	     this.display = function(){
		 if(this.parent.PM_display_mode == "t"){
		     return this.parent.formats[self.format].to_string(self.mnemonic,self.c,self.r,self.s,self.i);
		 }
		 else if(this.parent.PM_display_mode == "d"){
		     return self.encoding;
		 }
		 else if(this.parent.PM_display_mode == "h"){
		     var s = self.encoding.toString(16);
		     return "0x"+this.parent.smul("0",4 - s.length)+s;
		 }
		 else if(this.parent.PM_display_mode == "b"){
		     var s = self.encoding.toString(2);
		     return this.parent.smul("0",16 - s.length) + s;
		 }
	     }
	     this.check_valid = function(){
		 return this.parent.formats[self.format].validator(self.c, self.r, self.s, self.i);
	     }
	     this.run = function(){
		 self.exec(self.c, self.r, self.s, self.i);
	     }
	 },
	 step: function(){
	     if(!this.running) return;
	     this.debug_log(this.steps.count);
	     for(var k = 0; k < this.steps.count; k++){
		 var i = this.PM[this.PC];
		 this.debug_log("i",i);
		 i.run();
		 if(this.PC < this.display_pm_start || this.PC >= this.display_pm_start + this.display_pm_length){
		     this.display_pm_start = Math.max(0, this.PC - this.display_ram_length/2);
		 }
		 if(this.ram_updated.length > 0){
		     this.display_ram_start = Math.max(0, Math.min.apply(Math, this.ram_updated) - this.display_ram_length/2);
		 }
	     }
	 },
	 raise_error: function(s){
	     this.status = "Error: " + s;
	 },
	 truncate: function(num, bits, twos_complement){
	     var mod = 1<<bits;
	     num = ((num % mod)+mod)%mod;
	     return twos_complement ? (num >= 1<<(bits - 1) ? num - (1<<bits) : num) : num;
	 },
	 update_sreg: function(result, z, c, n){
	     this.debug_log("SREG for",result);
	     if(z) this.Z = this.truncate(result,8,false) == 0 ? 1 : 0;
	     if(c) this.C = result >= 256 || result < 0 ? 1 : 0;
	     if(n) this.N = this.truncate(result,8,true) <0 ? 1 : 0;
	 },
	 read_IO: function(s){
	     if(s == 16) return this.PIND & (~(this.DDRD));
	     else if(s == 17) return this.DDRD;
	     else if(s == 61) return this.SPL;
	     else if(s == 62) return this.SPH;
	     return 0;
	 },
	 write_IO: function(s,val){
	     if(s == 18){
		 this.PORTD = this.DDRD & val;
		 this.output();
	     }
	     else if(s == 17) this.DDRD = this.truncate(val,8,false);
	     else if(s == 61) this.SPL = this.truncate(val,8,false);
	     else if(s == 62) this.SPH = this.truncate(val,8,false);
	     if(this.output_type.selection == "simple"){
		 this.PIND = 0;
		 for(var i = 0; i < 8; i++)
		     this.PIND |= (this.io_state.switch_state[i] == "ON" ? 1 << i : 0)
		 this.PIND &= ~this.DDRD;
	     }
	 },
	 inc_ptr: function(reg){
	     if(this.RF[reg] == -1 || this.RF[reg] == 255){
		 this.RF[reg] = 0
		 this.RF[reg+1] = this.truncate(this.RF[reg+1]+1,8,false);
	     }
	     else this.RF[reg]++;
	     if(this.RF[reg] == 128){
		 this.RF[reg] = -128;
	     }
	 },
	 dec_ptr: function(reg){
	     this.RF[reg]--;
	     if(this.RF[reg] == -1){
		 this.RF[reg+1] = this.truncate(this.RF[reg+1]-1,8,false);
	     }
	     if(this.RF[reg] < -128){
		 this.RF[reg] = 127;
	     }
	 },
	 incSP: function(){
	     this.SPL++;
	     if(this.SPL == 256){
		 this.SPL = 0;
		 this.SPH = this.truncate(this.SPH+1,8,false);
	     }
	 },
	 decSP: function(){
	     this.SPL--;
	     if(this.SPL == -1){
		 this.SPL = 255;
		 this.SPH = this.truncate(this.SPH-1,8,false);
	     }
	 },
	 io_switch: function(i){
	     if(this.io_state.switch_state[i] == "ON"){
		 this.io_state.switch_state[i] = "OFF";
		 this.PIND &= ~(1<<i);
	     }
	     else if(this.io_state.switch_state[i] == "OFF"){
		 this.io_state.switch_state[i] = "ON";
		 this.PIND |= 1<<i;
	     }
	     this.PIND = this.PIND & ~this.DDRD;
	 },
	 output: function(){
	     var out_val = this.PORTD;
	     this.outputs.push(out_val);
	     //this.outputs.push(String.fromCharCode(out_val));
	 },
	 initialize: function(){
	     this.reset_program();
	     this.cm_setup();
	 },
	 end: function(){
	     if(!this.running) return;
	     this.running = false;
	     setTimeout(this.cm_setup, 0);
	 }

     },
     created: function(){
	 console.log("init");
	 this.$store.dispatch("RESET_PLUGIN_DATA","math");
	 //Guppy.init({"path":"/node_modules/guppy-js","symbols":"/node_modules/guppy-js/sym/symbols.json"});
     }, 
     mounted: function(){
	 console.log("Hello JSAVR");
	 console.log(this.instructions);
	 this.program = this.root.innerHTML.trim();
	 this.reset(true);
	 this.original_program = this.program;
	 this.initialize();

	 this.debug_log = this.debug_mode_feature == 'yes' ? console.log.bind(console) : this.do_nothing;
	 if(this.control){
	     this.control.set_program = function(new_prog){
		 this.change_program(new_prog);
	     }
	     this.control.get_program = function(){
		 if(this.editor) this.program = this.editor.getValue();
		 return this.program;
	     }
	     this.control.get_PM = function(addr){
		 return this.PM[addr].encoding;
	     }
	     this.control.get_RF = function(){
		 return this.RF;
	     }
	     this.control.get_RAM = function(addr){
		 return this.RAM[addr];
	     }
	     this.control.get_other = function(){
		 return {
		     "PC":this.PC,
		     "Z":this.Z,
		     "C":this.C,
		     "N":this.N,
		     "DDRD":this.DDRD,
		     "PIND":this.PIND,
		     "PORTD":this.PORTD,
		     "SPL":this.SPL,
		     "SPH":this.SPH
		 }
	     }
	 }
	 /* 
	  * 	 
	  * 	 var index = 0;
	  * 	 var doc_id = node+"-"+index;
	  * 	 var content = this.root.innerHTML.trim()
	  * 	 console.log("R",this.root,content);
	  * 	 //var res = Guppy.Doc.render(content, "text");
	  * 	 var res = {doc:content};
	  * 	 var doc_data = {};
	  * 	 //doc_data[index] = res.doc.get_vars().concat(res.doc.get_symbols());
	  * 	 doc_data[index] = ["x"];
	  * 	 //res.container.setAttribute("id","category-math-container-"+doc_id);
	  * 	 //var rendered_content = (new XMLSerializer()).serializeToString(res.container);
	  * 
	  * 	 
	  * 	 // Put this doc ID in the index for each var and symbol in the document
	  * 	 for(var i = 0; i < this.docs[node][index].length; i++) {
	  * 	     var v = this.docs[node][index][i];
	  * 	     if (!this.index[v]) this.index[v] = [];
	  * 	     if (this.index[v].indexOf(doc_id) < 0) this.index[v].push(doc_id);
	  * 	 }
	  * 
	  * 	 // Calculate the snippet that will be associated with this expression when it appears in listings
	  * 	 var snippet = "";
	  * 	 if(this.root.previousSibling){
	  * 	     snippet += this.root.previousSibling.textContent.split(" ").slice(-4).join(" ");
	  * 	 }
	  * 	 snippet += " [formula] "
	  * 
	  * 	 if(this.root.nextSibling) {
	  * 	     snippet += this.root.nextSibling.textContent.split(" ").slice(0,4).join(" ");
	  * 	 }
	  * 	 snippet = "..." + snippet + "...";
	  * 	 console.log("parprev",this.root.parentNode.previousSibling);
	  * 	 console.log("parnext",this.root.parentNode.nextSibling);
	  * 	 this.snippets[doc_id] = snippet;
	  * 
	  * 	 // Finally, set up component attributes
	  * 	 this.syms = this.docs[node][index];
	  * 	 this.rendered = rendered_content;
	  * 	 this.display_syms = false;
	  * 	 this.id = doc_id;
	  * 	 this.query = "";
	  * 	 this.node = node;*/
     }
 }
</script>
<style scoped>
 .simavr{
     display:inline-block;
     width:73em;
     /* min-height:40em; */
     font-size:10pt;
 }
 #simavr_rf{
     float:left;
     width:16em;
     border:1px solid #aaa;
     text-align:center;
 }

 #simavr_pm{
     float:left;
     width:13em;
     border:1px solid #aaa;
     text-align:center;
 }

 #simavr_ram{
     float:left;
     width:10em;
     border:1px solid #aaa;
     text-align:center;
 }

 #simavr_other{
     float:left;
     width:10em;
     border:1px solid #aaa;
     text-align:center;
 }

 .simavr_title{
     width:100%;
     text-align:center;
     display:inline-block;
     font-size:12pt;
     margin:auto;
     padding-bottom:5px;
     line-height:2.5em;
 }

 .simavr_status{
     display:inline-block;
     padding:5px;
     border-left:1px solid #aaa;
     /* border-radius:5px; */
     margin:5px;
     width:45%;
     font-size:9pt;
     float:right;    
 }

 .active_line{
     background-color:#f66;
 }
 .simavr_label{
     font-size:10pt;
     color:#333;
     display:inline-block;
     width:2em;
 }
 .simavr_label_long{
     font-size:10pt;
     color:#333;
     display:inline-block;
     margin-right:0.5ex;
     min-width:2em;
 }

 .simavr_reg{
     text-align:left;
     display:inline-block;
     padding:4px;
     /*margin:0 2px 2px 0;*/
     width:7em;
 }
 .simavr_pm{
     text-align:left;
     display:inline-block;
     padding:4px;
     /*margin:0 2px 2px 0;*/
     width:12em;
 }

 .simavr_mem_start{
     padding:4px;
     width:4em;
     margin:4px;
 }

 .simavr_ram{
     text-align:left;
     display:inline-block;
     padding:4px;
     /*margin:0 2px 2px 0;*/
     width:7em;
 }

 .simavr_controls{
     display:inline-block;
     width:90%;
     height:50px;
     border: 2px solid #ccc;
     margin:auto;
     margin-bottom:5px;
 }

 .simavr_programming{
     display:inline-block;
     float:left;
     width:70%;
 }

 .simavr_output_container{
     display:inline-block;
     float:left;
     width:25%;
 }

 .simavr_simulator{
     display:inline-block;
     float:left;
     width:75%;
 }

 .simavr_output{
     display:inline-block;
     padding:5px;
     width:90%;
     border:1px solid #aaa;
     overflow-x:scroll;
     overflow-y:scroll;
 }

 .simavr_program{
     width:90%;
 }

 .simavr_normal{
     background-color:#c66;
 }

 .simavr_updated{
     background-color:#6c6;
 }

 .simavr_active{
     background-color:#cc6;
 }

 .simavr_display_button{
     display:inline-block;
     padding:2px;
 }

 .simavr_enabled_button{
     background-color:#66a;
 }

 .simavr_disabled_button{
     background-color:#aaa;
 }

 .simavr_display_button:hover{
     display:inline-block;
     cursor:pointer;
     color:#f33;
 }
 .simavr_button{
     display:inline-block;
     padding:8px;
     border-radius:5px;
     height:25px;
     color:white;
     margin:5px;
     cursor:pointer;
 }

 .simavr_button:hover{
     display:inline-block;
     cursor:pointer;
     color:#f33;
 }

 .simavr_io_num{
     width:3em;
     border:3px solid black;
     background-color:#363;
     color:#ff4;
     font-size:17pt;
     padding:5px;
 }

 .simavr_io_switch{
     display:inline-block;
     width:3em;
     border:3px solid black;
     font-size:17pt;
     padding:5px;
     cursor:pointer;
 }

 .simavr_io_switch_on{
     background-color:#3f3;
 }

 .simavr_io_switch_off{
     background-color:#f33;
 }
</style>
