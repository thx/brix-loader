define(function(){var d="0.0.1",i=(Math.random()+"").replace(/\D/g,"");return{VERSION:d,ATTRS:{id:"bx-id",cid:"bx-cid",options:"bx-options"},SELECTORS:{id:"[bx-id]",cid:"[bx-cid]",options:"[bx-options]"},EVENTS:{ready:"ready",destroy:"destroy"},OPTIONS:["element","moduleId","clientId","parentClientId","childClientIds","data","template"],EXPANDO:"Brix"+d+i,UUID:0,RE_EVENT:/bx\-(?!id|cid|options)(.+)/,FN_ARGS:/([^()]+)(?:\((.*?)\))?/,LOADER_NAMESPACE:"._loader",COMPONENT_NAMESPACE:"._component",PREFIX:"bx-"}});