import { Component, OnInit,Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-agent-dialogbox',
  templateUrl: './agent-dialogbox.component.html',
  styleUrls: ['./agent-dialogbox.component.scss']
})




export class AgentDialogboxComponent implements OnInit{

  constructor( @Inject(MAT_DIALOG_DATA) public agent_data:any ) {}
  ngOnInit(): void {}

  @Input() indicators = true;

  selectedIndex = 0 ;

  selectImage(index : number):void{
    this.selectedIndex = index;
  }
  
}