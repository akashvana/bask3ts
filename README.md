
### Instructions for setup and demo

Learn more about the project here: https://devfolio.co/projects/dmandates-17ff

Contract deployments:
- Arbitrum:   0xd269f60726D49Da020D66f2401883CE204b4a20c
- Base: 	 	0xd269f60726D49Da020D66f2401883CE204b4a20c
- Scroll:        0x9c386eAcBdB56a105fAbD975437e72b5E227d9F5
- zkevm        0xd269f60726D49Da020D66f2401883CE204b4a20c
  
1. install postgres, if not already installed

```bash
brew  install  postgresql@14
brew  services  start  postgresql
```
2. connect to a db 'bask3ts' and populate it with the dump.sql file in this repo

```bash
psql  postgres
\#postgres  create  database  bask3ts;
```

```bash
psql  bask3ts < dump.sql
```

3. install node dependencies

```bash
npm  install
```

4. switch to the client directory and start the server.

```bash
cd  client/
npm  install
npm  run  dev
```

5. log on to localhost:3000 and choose your basket, proceed to create session and invest!