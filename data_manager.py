import json

def loadJson(filename):
    jsonData = open(filename , 'r')
    data = json.load(jsonData)
    jsonData.close()
    return data

def listQuestions(jsonData, topic):
    for i in jsonData['jillsquiz']:
        if i['topic'] == topic:
            return i['quizquestions']

def loadQuestion(list, index):
    question = list[index]['question']
    answers = []
    correctAnswer = list[index]['correct_answer']

    for i in list[index]['answers']:
        answers.append(i)

    return  question, answers, correctAnswer    

def loadTopics (list):
    topics = []
    for i in list['jillsquiz']:
        topics.append(i['topic'])
    
    return topics
