import json

def getSampleLevel(i):
	return {
		"name": "TitleLevel" + str(i),
		"fromdict": 27,
		"todict": 32,
		"maxenemies": 6,
		"checkpoint": False,
		"distance": 50,
		"mission": {
			"title": "TitleMission" + str(i),
			"description": "DescriptionMission" + str(i)
		}
	}

levels = []

i = 1
for line in open("astroidlist.txt", "r"):
	if len(line.split("\t")) >= 2:
		sampleLevel = getSampleLevel(i)
		levels.append(sampleLevel)

		i += 1
	elif len(line.strip()) > 0 and "=" not in line:
		sampleLevel = getSampleLevel(i)
		planetSprite = line.strip().lower() + ".png"

		sampleLevel["planet"] = planetSprite
		sampleLevel["checkpoint"] = True
		levels.append(sampleLevel)

		i += 1

with open("levels.json", "w+") as out:
	out.write(json.dumps({
		"levels": levels
	}, indent=4))