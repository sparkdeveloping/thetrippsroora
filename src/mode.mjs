// Hosted demo is explicit and isolated from real guest services.
export function demoEnabled(env=process.env){return env.ROORA_DEMO_MODE==='1'||(env.NODE_ENV==='development'&&env.ALLOW_DEMO==='1');}
