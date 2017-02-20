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
translations_en = {}

i = 1
for line in open("astroidlist.txt", "r"):
	if len(line.split("\t")) >= 2:
		sampleLevel = getSampleLevel(i)
		levels.append(sampleLevel)

		translations_en[sampleLevel["name"]] = line.split("\t")[0]

		i += 1
	elif len(line.strip()) > 0 and "=" not in line:
		sampleLevel = getSampleLevel(i)
		planetSprite = line.strip().lower() + ".png"

		sampleLevel["planet"] = planetSprite
		sampleLevel["checkpoint"] = True
		levels.append(sampleLevel)

		translations_en[sampleLevel["name"]] = line.strip()

		i += 1

with open("levels.json", "w+") as out:
	out.write(json.dumps({
		"levels": levels
	}, indent=4))

with open("translate_asteroids_en.json", "w+") as out:
	out.write(json.dumps(translations_en, indent=4, sort_keys=True))