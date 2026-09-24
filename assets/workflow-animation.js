
    (function(){
      const root=document.getElementById('lead-smooth-flow');
      if(!root)return;
      const stage=root.querySelector('.flow-stage');
      
      
      const dots=Array.from(root.querySelectorAll('.flow-traveller'));
      const trails=Array.from(root.querySelectorAll('.flow-tail'));
      const lightGroup=root.querySelector('.flow-lights');
      const lights={};
      root.querySelectorAll('[data-box]').forEach(frame=>{
        const light=frame.cloneNode(false);
        light.setAttribute('class','box-light');
        light.removeAttribute('data-box');
        lightGroup.appendChild(light);
        lights[frame.dataset.box]=light;
      });
      const routes=Object.fromEntries(Array.from(root.querySelectorAll('[data-route]'),el=>[el.dataset.route,{el,length:el.getTotalLength()}]));
      const moves=[
        {start:450,ms:1600,paths:['linkedin','sources']},
        {start:2600,ms:650,paths:['verify']},
        {start:3850,ms:650,paths:['clean']},
        {start:5100,ms:650,paths:['campaign']},
        {start:6350,ms:1700,paths:['smartlead','instantly','hubspot']},
        {start:8650,ms:1700,paths:['smartlead-merge','instantly-merge','hubspot-merge']},
        {start:10950,ms:650,paths:['inbox']},
        {start:12350,ms:700,paths:['results']},
        {start:13700,ms:650,paths:['happy']}
      ];
      const pulses=[
        {start:0,ms:1150,boxes:['linkedin','sources']},
        {start:2050,ms:1150,boxes:['raw']},
        {start:3250,ms:1200,boxes:['verify']},
        {start:4500,ms:1200,boxes:['clean']},
        {start:5750,ms:1200,boxes:['campaign']},
        {start:8050,ms:1200,boxes:['smartlead','instantly','hubspot']},
        {start:10350,ms:1200,boxes:['automation']},
        {start:11600,ms:1400,boxes:['inbox']},
        {start:11760,ms:1240,boxes:['reply']},
        {start:13050,ms:1200,boxes:['results']},
        {start:14350,ms:1400,boxes:['happy']}
      ];
      const total=16250;
      const clamp=value=>Math.max(0,Math.min(1,value));
      const ease=value=>{const t=clamp(value);return t*t*(3-2*t);};
      let elapsed=0,last=null,frameId=null,pointRadius=7;
      let paused=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      
      function render(){
        const time=elapsed%total;
        Object.values(lights).forEach(light=>light.style.opacity='0');
        pulses.forEach(pulse=>{
          const age=time-pulse.start;
          if(age<0||age>pulse.ms)return;
          const strength=ease(age/210)*(1-ease((age-pulse.ms*.36)/(pulse.ms*.64)));
          pulse.boxes.forEach(name=>lights[name].style.opacity=String(strength));
        });
        dots.forEach(dot=>dot.setAttribute('opacity','0'));
        trails.forEach(trail=>trail.setAttribute('opacity','0'));
        const move=moves.find(m=>time>=m.start&&time<m.start+m.ms+220);
        if(!move)return;
        const age=time-move.start;
        const progress=ease(age/move.ms);
        const opacity=ease(age/140)*(1-ease((age-move.ms)/220));
        const placed=[];
        move.paths.forEach((name,index)=>{
          const route=routes[name];
          const distance=progress*route.length;
          const p=route.el.getPointAtLength(distance);
          const overlapping=placed.some(other=>Math.hypot(p.x-other.x,p.y-other.y)<pointRadius*.9);
          if(overlapping)return;
          placed.push(p);
          dots[index].setAttribute('transform','translate('+p.x+' '+p.y+')');
          dots[index].setAttribute('opacity',String(opacity));
          const tailLength=Math.min(32,distance)*Math.sin(Math.PI*clamp(age/move.ms));
          if(tailLength<.1)return;
          let d='';
          for(let i=0;i<=8;i++){
            const q=route.el.getPointAtLength(distance-tailLength+tailLength*i/8);
            d+=(i?' L':'M')+q.x.toFixed(2)+' '+q.y.toFixed(2);
          }
          trails[index].setAttribute('d',d);
          trails[index].setAttribute('opacity',String(opacity*.62));
        });
      }
      function tick(now){
        if(!root.isConnected){resize.disconnect();return;}
        if(last!==null&&!paused&&!document.hidden)elapsed+=Math.min(now-last,80);
        last=now;render();frameId=requestAnimationFrame(tick);
      }
      
      const resize=new ResizeObserver(()=>{
        const diagram=root.querySelector('.flow-diagram');
        const scale=Math.max(.1,Math.min(diagram.clientWidth/930,diagram.clientHeight/1320));
        pointRadius=Math.max(7,3.2/scale);
        root.querySelectorAll('.flow-point').forEach(point=>point.setAttribute('r',pointRadius));
        root.querySelectorAll('.flow-halo').forEach(halo=>halo.setAttribute('r',pointRadius+6));
      });
      resize.observe(stage);render();frameId=requestAnimationFrame(tick);
    })();
  