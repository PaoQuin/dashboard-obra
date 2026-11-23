import json, datetime as dt, sys
OUT = sys.argv[1]
# Curva S (acumulado planificado / realizado por semana), de la planilla de la ingeniera
P = [0,0.045,0.09,0.16,0.235,0.303,0.36,0.413,0.47,0.55,0.62,0.695,0.755,0.821,0.865,0.9,0.91,0.92,0.93,0.94,0.945,0.946,0.948,0.957,0.973,1.0]
R = [0,0.03,0.08,0.143,0.206,0.284,0.342,0.3856,0.42,0.475,0.53,0.59,0.63,0.69,0.75,0.755,0.76,0.786,0.81,0.81,0.81,0.812,0.813,0.815]
INICIO = dt.date(2023,9,29)          # contrato inicial (planilla)
FIN_PLANILLA = dt.date(2024,4,30)    # fin del periodo de la planilla final
def fecha(semana_frac):              # semana 1 empieza el 29/09/2023
    return INICIO + dt.timedelta(days=round((semana_frac-1)*7))
def semana_cuando(curva, p):          # semana (fraccional) en que una curva alcanza el avance p
    if p <= 0: return 0.0
    for w in range(1,len(curva)):
        if curva[w] >= p:
            return (w-1) + (p-curva[w-1])/(curva[w]-curva[w-1])
    return None
LAG_FINAL = 23 - semana_cuando(P, R[23])   # atraso al cierre de la curva (semana 23)
def atraso(semana_plan):              # atraso en semanas segun la Curva S en ese punto de la obra
    p = P[int(semana_plan)] if semana_plan < len(P) else 1.0
    wr = semana_cuando(R, p)
    return (wr - semana_plan) if wr is not None else LAG_FINAL
def fechas(s_plan, f_plan):
    ini_plan = fecha(s_plan); fin_plan = fecha(f_plan+1) - dt.timedelta(days=1)
    ini_real = ini_plan + dt.timedelta(days=round(max(0, atraso(s_plan-1))*7))
    fin_real = fin_plan + dt.timedelta(days=round(max(0, atraso(f_plan))*7))
    return ini_plan, fin_plan, min(ini_real, FIN_PLANILLA), min(fin_real, FIN_PLANILLA)
# ---- Geometría aproximada a partir de COMPUTOS (luces entre columnas 6,05 m y 3,5 / 4,9 / 5,35 m) ----
XA, XB = 2.5, 8.55
Z = {'f':0.0, 3:3.5, 4:8.4, 5:13.75, 6:19.1, 7:24.45}
col = {'C-01':(0.0,0,(0.65,0.25)),'C-02':(3.7,0,(0.2,0.3)),'C-03':(7.4,0,(0.2,0.3)),'C-04':(11.0,0,(0.65,0.25)),
       'C-05':(XA,Z[3],(0.2,0.3)),'C-06':(XB,Z[3],(0.2,0.3)),'C-07':(XA,Z[4],(0.2,0.3)),'C-08':(XB,Z[4],(0.2,0.3)),
       'C-09':(XA,Z[5],(0.3,0.3)),'C-10':(XB,Z[5],(0.3,0.3)),'C-11':(XA,Z[6],(0.3,0.3)),'C-12':(XB,Z[6],(0.3,0.3)),
       'C-13':(XA,Z[7],(0.3,0.3)),'C-14':(XB,Z[7],(0.3,0.3))}
zap = {'C-10':(1.9,2.1),'C-12':(1.9,2.1),'C-06':(1.7,1.9),'C-08':(1.7,1.9),'C-01':(1.9,1.5),'C-04':(1.9,1.5),'C-02':(1.7,1.5),'C-03':(1.7,1.5)}
for c in col: zap.setdefault(c,(1.5,1.9))
tramos = [('C-11','C-13'),('C-12','C-14'),('C-11','C-12'),('C-13','C-14'),('C-09','C-11'),('C-10','C-12'),('C-07','C-08'),
          ('C-07','C-09'),('C-09','C-10'),('C-08','C-10'),('C-03','C-04'),('C-05','C-06'),('C-06','C-08'),('C-05','C-07'),
          ('C-02','C-03'),('C-01','C-02'),('C-01','C-05'),('C-03','C-06')]
H_PB, H_PA, LOSA = 3.5, 3.1, 0.25
def pieza(x,y,z,a,h,l,**k): d={'posicion':{'x':round(x,3),'y':round(y,3),'z':round(z,3)},'dimensiones':{'ancho':round(a,3),'alto':round(h,3),'largo':round(l,3)}}; d.update(k); return d
def viga(c1,c2,y,ancho,alto):
    (x1,z1,_),(x2,z2,_) = col[c1],col[c2]
    if abs(z1-z2) < 1e-6: return pieza((x1+x2)/2,y,z1,abs(x2-x1),alto,ancho)
    if abs(x1-x2) < 1e-6: return pieza(x1,y,(z1+z2)/2,ancho,alto,abs(z2-z1))
    # tramo diagonal: se aproxima con su proyección más larga
    return pieza((x1+x2)/2,y,(z1+z2)/2,max(abs(x2-x1),ancho),alto,max(abs(z2-z1),ancho))
piezas = {
 'Carpeta_HoPo':   [pieza(x,-1.375,z,*zap[c][:1],0.05,zap[c][1]) for c,(x,z,_) in col.items()],
 'Zapatas':        [pieza(x,-1.15,z,zap[c][0],0.4,zap[c][1]) for c,(x,z,_) in col.items()],
 'Columnas':       [pieza(x,(-0.95+H_PB)/2,z,s[0],H_PB+0.95,s[1],nombre=c) for c,(x,z,s) in col.items()] +
                   [pieza(x,H_PB+LOSA+H_PA/2,z,s[0],H_PA,s[1],nombre=c+' PA') for c,(x,z,s) in col.items()],
 'Vigas_contrapiso':[viga(a,b,0.175,0.4,0.35) for a,b in tramos],
 'Vigas_PB_PA':    [viga(a,b,H_PB-0.2,0.2,0.4) for a,b in tramos] + [viga(a,b,H_PB+LOSA+H_PA-0.2,0.2,0.4) for a,b in tramos],
 'Losa_alivianada_PA':[pieza(5.5,H_PB+LOSA/2,14.0,8.5,LOSA,21.5)],
 'Escalera':       [pieza(1.3,H_PB/2,1.9,1.2,0.2,4.6,rotacion={'x':-0.80})],
 'Losa_maciza':    [pieza(1.75,H_PB+0.06,-0.3,3.5,0.12,0.6)],
 'Piso_HoA':       [pieza(5.5,0.05,10.0,11.0,0.1,13.0)],
 'Cubierta_metalica':[pieza(5.5,H_PB+LOSA+H_PA+0.1,12.0,11.6,0.1,25.0)],
 'Canaleta':       [pieza(11.35,H_PB+LOSA+H_PA,12.0,0.2,0.2,25.0)],
 'Panel_3D':       [pieza(11.1,H_PB+LOSA+H_PA/2,6.0,0.1,H_PA,11.5)],
 'Estructura_fachada':[pieza(5.5,H_PB+2.2,-0.5,11.0,4.4,0.15)],
 'Cenefa_aluminio':[pieza(5.5,H_PB+LOSA+H_PA+0.6,-0.65,11.0,1.2,0.08)],
}
# ---- Costos: hoja "PLANILLA 3 C-OC #1", módulos M03 y M04 (Recepción GAC) ----
# (id, nombre, item, unidad, cant_contrato, cant_real, precio_unit, total_contrato, total_real, semanas plan)
items = [
 ('Carpeta_HoPo','Carpeta de hormigón pobre','M03-1','m³',2.83,5.54,1079.22,3054.19,5978.88,(1,1)),
 ('Zapatas','Zapatas de H°A°','M03-2','m³',8.82,11.40,2395.22,21125.84,27305.51,(1,3)),
 ('Vigas_contrapiso','Vigas de H°A° nivel contrapiso','M03-5','m³',6.38,7.37,3058.50,19513.23,22541.15,(3,4)),
 ('Columnas','Columnas de H°A° (fundación, PB y PA)','M03-3','m³',9.25,9.14,3724.38,34450.51,34040.83,(3,8)),
 ('Vigas_PB_PA','Vigas de H°A° nivel PB y PA','M03-6','m³',25.20,22.02,3755.76,94645.15,82701.84,(5,9)),
 ('Losa_alivianada_PA','Losa alivianada c/vigueta 20+5 nivel PA','M03-7','m²',187.00,183.13,437.16,81748.92,80057.11,(6,8)),
 ('Escalera','Escalera de H°A°','M03-4','m³',2.61,2.61,5062.20,13212.34,13212.34,(7,8)),
 ('Losa_maciza','Losa maciza con junta de dilatación','M03-8','m³',2.18,3.48,1737.15,3786.99,6045.28,(8,9)),
 ('Piso_HoA','Piso de H° e=10 cm con malla electrosoldada','M03-9','m²',143.00,143.10,141.62,20251.66,20265.82,(10,11)),
 ('Cubierta_metalica','Cubierta metálica con perfiles celosía','M04-1','m²',283.49,283.78,275.00,77959.75,78039.50,(11,14)),
 ('Panel_3D','Panel estructural 3D con revoque','M04-3','m²',84.00,35.53,280.87,23593.08,9979.31,(12,14)),
 ('Canaleta','Canaleta de chapa galvanizada','M04-2','m',25.00,26.44,160.38,4009.50,4240.45,(14,15)),
 ('Estructura_fachada','Estructura metálica para fachada y letrero','M04-4','m²',28.96,48.34,510.90,14795.66,24696.91,(15,17)),
 ('Cenefa_aluminio','Fachada cenefa aluminio letrero','M04-5','m²',28.96,28.96,626.10,18131.86,18131.86,(17,19)),
]
tipo = {'Columnas':'columna','Zapatas':'fundacion','Carpeta_HoPo':'fundacion','Vigas_contrapiso':'viga','Vigas_PB_PA':'viga',
        'Losa_alivianada_PA':'losa','Losa_maciza':'losa','Piso_HoA':'piso','Escalera':'escalera','Cubierta_metalica':'cubierta',
        'Canaleta':'cubierta','Panel_3D':'muro','Estructura_fachada':'fachada','Cenefa_aluminio':'fachada'}
out=[]
for i,(idn,nom,item,u,cc,cr,pu,tc,tr,(s,f)) in enumerate(items):
    ip,fp,ir,fr = fechas(s,f)
    e = {'id_elemento':idn,'nombre':nom,'tipo':tipo[idn],'item_planilla':item,'unidad':u,
         'cantidad_contrato':cc,'cantidad_real':cr,'precio_unitario':pu,
         'fecha_inicio_plan':ip.isoformat(),'fecha_inicio':ir.isoformat(),
         'fecha_fin':fp.isoformat(),'fecha_fin_real':fr.isoformat(),
         'costo_presupuestado':tc,'costo_real':tr}
    if tipo[idn] in ('cubierta','fachada','muro'): e['opacidad_max']=0.45
    e['estado'] = 'sobrecosto' if tr>tc else ('atrasado' if fr>fp else 'en_orden')
    e['piezas'] = piezas[idn]
    out.append(e)
meta = {'obra':'Construcción Recepción de Vehículos GAC (bloque GAC)','fuente_costos':'Planilla de avance #3 final, módulos M03 y M04',
        'fuente_medidas':'Hoja COMPUTOS (medidas reales; posiciones aproximadas)','fuente_fechas':'Plan: Curva S desde el contrato del 29/09/2023. Real: plan + atraso medido en la Curva S (estimado por ítem)'}
json.dump({'meta':meta,'elementos':out},open(OUT,'w'),indent=2,ensure_ascii=False)
for e in out: print(f"{e['id_elemento']:20} {e['estado']:11} {e['fecha_inicio']} plan_fin {e['fecha_fin']} real_fin {e['fecha_fin_real']}  {e['costo_presupuestado']:>10} -> {e['costo_real']:>10}  {100*(e['costo_real']-e['costo_presupuestado'])/e['costo_presupuestado']:+.1f}%  piezas {len(e['piezas'])}")
print('total piezas', sum(len(e['piezas']) for e in out))
