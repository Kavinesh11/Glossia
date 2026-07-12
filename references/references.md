# 📚 Sign Language Datasets

This repository compiles datasets used for machine learning research in sign language recognition.

---

## 🗂 Dataset Table

| id | Dataset name              | Country | Classes | Subjects | Samples   | Data   | Language Level | Type         | Annotations | Availability | On Disk |
|----|---------------------------|---------|---------|----------|-----------|--------|----------------|--------------|-------------|--------------|---------|
| 1  | DGS Kinect 40             | Ger     | 40      | 15       | 3000      |        | W              | V,[9]        |             | PA           | Y       |
| 2  | RWTH-PHOENIX-Weather      | Ger     | 1200    | 9        | 45760     | 52gb   | S              | V            | [18]        | PA           | Y       |
| 3  | SIGNUM                    | Ger     | 450     | 25       | 33210     | 920gb  | S              | V            |             | PA,[5]       | N       |
| 4  | GSL 20                    | Gre     | 20      | 6        | ~840      |        | W              |              |             | CA           | Y       |
| 5  | Boston ASL LVD            | USA     | 3300+   | 6        | 9800      |        | W              | V,[9]        | [19,20]     | PA           | N       |
| 6  | PSL Kinect 30             | Pol     | 30      | 1        | 300       | ~1.2gb | W              | V,[10]       |             | PA           | Y       |
| 7  | PSL ToF 84                | Pol     | 84      | 1        | 1680      | ~33gb  | W              | V,[11]       |             | PA           | N       |
| 8  | PSL 101                   | Pol     | ?       | ?        | ?         | ?      | ?              | ?            |             | CA           | N       |
| 9  | LSA64                     | Arg     | 64      | 10       | 3200      | 20gb   | W              | VR           | [21]        | PA           | Y       |
| 10 | BosphorusSign             | Tur     |         |          |           |        |                |              |             | Non          | N       |
| 11 | MSR Gesture 3D            | USA     | 12      | 10       | 336       | 28mb   | W              | VD           |             | PA           | N       |
| 12 | DEVISIGN-G                | Chi     | 36[1]   | 8        | 432       | ?      | W              | VR           |             | CA           | N       |
| 13 | DEVISIGN-D                | Chi     | 500     | 8        | 6000      | ?      | W              | VR           |             | CA           | N       |
| 14 | DEVISIGN-L                | Chi     | 2000    | 8        | 24000     | ?      | W              | VR           |             | CA           | N       |
| 15 | IIITA -ROBITA             | Ind     | 23      | ?        |           | 284mb  | W              | VR,[15]      |             | CA           | N       |
| 16 | Purdue ASL                | USA     | ?       | 14[3]    | ?         | ?      | W/S            | V,[14]       |             | [6]          | N       |
| 17 | CUNY ASL                  | USA     | ?       | 8        | ~33000[4] | ?      | S              | VR,[16]      | [7]         | U            | N       |
| 18 | SignsWorld Atlas          | Ara     | [2]     | 10       | ?         | ?      | W,S,H          | V,[17,14]    | ?           | U            | N       |

---

## 🖐 Handshape / Fingerspelling Datasets

| id | Name                        | Country | Classes | Subjects | Samples | Data   | Type             | Availability |
|----|-----------------------------|---------|---------|----------|---------|--------|------------------|--------------|
| 1  | ASL Fingerspelling A        | USA     | 24      | 5        | 131000  | 2.1gb  | images (depth+rgb)| [Free download](https://) |
| 2  | ASL Fingerspelling B        | USA     | 24      | 9        |         | 317mb  | images (depth)   | [Free download](https://) |
| 3  | LSA16 handshapes            | Arg     | 16      | 10       | 800     | 7mb    | images (rgb)     | [Free download](https://) |
| 4  | PSL Fingerspelling ToF      | Pol     | 16      | 3        | 960     | ~290mb | 3D point cloud   | [Free download](https://) |
| 5  | ISL                         | Iri     | [23]    | 6        | [24]    | 170mb  | segmented images | [Free download](https://) |
| 6  | RWTH-PHOENIX Handshapes     | Ger     | 60      |          | [25]    | +17gb  | Hand Images (rgb)| [Free download](https://) |
| 7  | Japanese Fingerspelling     | Jap     | 41      | 10       | 8055    | 4.5mb  | [26]             | [Free download](https://) |
| 8  | NUS hand posture dataset I  | Sin     | 10      | ?        | 240     | 3mb    | images (rgb)     | [Free download](https://) |
| 9  | NUS hand posture dataset II | Sin     | 10      | 40       | 2000    | 73mb   | images (rgb)     | [Free download](https://) |
| 10 | CIARP                       | -       | 10      | ?        | 6000    | 11mb   | images (rgb)     | [Free download](https://) |
| 11 | RTWH Fingerspelling dataset | Ger     |         |          |         |        |                  |              |
| 12 | Indian Kinect               | Ind     | 40      | 18       | 5041    | 2gb    | [27]             | [Free download](https://) |
| 13 | ArASL                       | Ara     | 32      | ?        | 54049   | 64mb   | images (rgb)     | [Free download](https://) |
| 14 | ChicagoFSWild               | USA     | [2]     | 160      | ?       |        | images (rgb)     | [Free download](https://) |
| 15 | ChicagoFSWild+              | USA     |         |          |         |        |                  |              |

---

## 📑 Related Links

- [F2ED: Emotion Recognition Dataset](https://neurohive.io/ru/novosti/f2ed-dataset-dlya-raspoznavaniya-emocij-na-lice/?fbclid=IwAR3krXoMfAJySGuZAQsVkDwPoNIfex44EgLvDJCK5-24kX9hhVYzV_7WS4E)  
- Kevin Murphy maintains a similar list for [Action Recognition Datasets](https://)  
- Other compilations: Chalearn dataset list, RWTH datasets list  

---

## 📌 Notes

- [1] Letters/numbers  
- [2] Multiple types  
- [3] Only 5 available  
- [4] Glosses  
- [5] 1TB, contact author to obtain hard drive  
- [6] Request DVDs/HD  
- [7] Signstream  
- [9] Multiple angles  
- [10] Depth from Kinect camera  
- [11] ToF camera  
- [15] 320x240 resolution  
- [16] Mocap data  
- [17] Images  
- [18] Face, hand, end/start (unfinished)  
- [19] Hand  
- [20] End/start  
- [21] Hands and Head position  
- [23] 23 static + 3 dynamic  
- [24] 58114 frames / 468 videos  
- [25] 3359 labelled + 17gb unlabeled  
- [26] Segmented images (rgb), 32x32  
- [27] Images (rgb+depth) 640x480  
