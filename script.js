// 퀴즈 데이터를 저장할 배열
let quizzes = JSON.parse(localStorage.getItem('quizzes')) || [];
let currentQuiz = null;
let currentSubject = '';
let score = {
    correct: 0,
    total: 0
};

// 기본 퀴즈 데이터
const sampleQuizzes = [
    {
        subject: "한국사",
        question: "조선을 건국한 왕은 누구인가요?",
        options: ["이성계", "왕건", "견훤", "궁예"],
        correctAnswer: 0
    },
    {
        subject: "한국사",
        question: "삼국 통일을 이룬 나라는?",
        options: ["신라", "고구려", "백제", "가야"],
        correctAnswer: 0
    },
    {
        subject: "과학",
        question: "물의 화학식은?",
        options: ["H2O", "CO2", "O2", "NH3"],
        correctAnswer: 0
    },
    {
        subject: "과학",
        question: "사람의 심장은 몇 개의 심방과 심실로 이루어져 있나요?",
        options: ["2심방 2심실", "2심방 1심실", "1심방 2심실", "1심방 1심실"],
        correctAnswer: 0
    },
    {
        subject: "상식",
        question: "우리나라에서 가장 높은 산은?",
        options: ["한라산", "백두산", "지리산", "설악산"],
        correctAnswer: 1
    },
    {
        subject: "상식",
        question: "우리나라 화폐의 최소 단위는?",
        options: ["1원", "10원", "100원", "1000원"],
        correctAnswer: 0
    }
];

// 한국어 퀴즈 데이터베이스
const koreanQuizDatabase = [
    {
        subject: "한국사",
        questions: [
            {
                question: "임진왜란이 일어난 연도는?",
                options: ["1592년", "1596년", "1600년", "1588년"],
                correctAnswer: 0
            },
            {
                question: "세종대왕이 창제한 문자는?",
                options: ["한글", "한자", "가나", "히라가나"],
                correctAnswer: 0
            }
        ]
    },
    {
        subject: "과학",
        questions: [
            {
                question: "다음 중 지구에서 가장 가까운 행성은?",
                options: ["금성", "화성", "목성", "수성"],
                correctAnswer: 0
            },
            {
                question: "사람의 정상 체온은 몇 도인가요?",
                options: ["36.5도", "37.5도", "35.5도", "38.5도"],
                correctAnswer: 0
            }
        ]
    },
    {
        subject: "상식",
        questions: [
            {
                question: "우리나라의 수도는?",
                options: ["서울", "부산", "인천", "대전"],
                correctAnswer: 0
            },
            {
                question: "태극기의 가운데 원은 무엇을 상징하나요?",
                options: ["음양", "우주", "하늘", "땅"],
                correctAnswer: 0
            }
        ]
    }
];

// 미리 생성된 퀴즈 데이터베이스
const generatedQuizDatabase = {
    "한국사": [
        {
            question: "고려 시대 최고의 승려이자 '해동고승전'을 저술한 승려는?",
            options: ["각훈", "의천", "지눌", "혜심"],
            correctAnswer: 0
        },
        // ... 더 많은 퀴즈 추가
    ],
    "과학": [
        {
            question: "빛의 삼원색은?",
            options: ["빨강, 초록, 파랑", "빨강, 노랑, 파랑", "빨강, 보라, 초록", "노랑, 파랑, 초록"],
            correctAnswer: 0
        },
        // ... 더 많은 퀴즈 추가
    ],
    "상식": [
        {
            question: "우리나라 최초의 지��철이 개통된 도시는?",
            options: ["서울", "부산", "대구", "인천"],
            correctAnswer: 0
        },
        // ... 더 많은 퀴즈 추가
    ]
};

// 화면 전환 함수
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.style.display = 'none';
    });
    document.getElementById(screenId).style.display = 'block';

    if (screenId === 'quiz-select') {
        updateSubjectList();
    }
}

// 퀴즈 생성 폼 제출 처리
document.getElementById('quiz-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const quiz = {
        subject: document.getElementById('subject').value,
        question: document.getElementById('question').value,
        options: [
            document.getElementById('option1').value,
            document.getElementById('option2').value,
            document.getElementById('option3').value,
            document.getElementById('option4').value
        ],
        correctAnswer: parseInt(document.getElementById('correct-answer').value) - 1
    };

    quizzes.push(quiz);
    localStorage.setItem('quizzes', JSON.stringify(quizzes));
    
    alert('퀴즈가 저장되었습니다!');
    this.reset();
});

// 과목 목록 업데이트
function updateSubjectList() {
    const subjects = [...new Set(quizzes.map(quiz => quiz.subject))];
    const subjectList = document.getElementById('subject-list');
    subjectList.innerHTML = '';
    
    subjects.forEach(subject => {
        const button = document.createElement('button');
        button.textContent = subject;
        button.onclick = () => startQuiz(subject);
        subjectList.appendChild(button);
    });
}

// 퀴즈 시작
function startQuiz(subject) {
    currentSubject = subject;
    score = { correct: 0, total: 0 };
    const subjectQuizzes = quizzes.filter(quiz => quiz.subject === subject);
    
    if (subjectQuizzes.length === 0) {
        alert('해당 과목의 퀴즈가 없습니다.');
        return;
    }

    currentQuiz = getRandomQuiz(subject);
    showScreen('quiz-solve');
    displayQuiz();
}

// 랜덤 퀴즈 선택
function getRandomQuiz(subject) {
    const subjectQuizzes = quizzes.filter(quiz => quiz.subject === subject);
    return subjectQuizzes[Math.floor(Math.random() * subjectQuizzes.length)];
}

// 퀴즈 표시
function displayQuiz() {
    document.getElementById('current-subject').textContent = currentSubject;
    document.getElementById('question-text').textContent = currentQuiz.question;
    
    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = '';
    
    currentQuiz.options.forEach((option, index) => {
        const button = document.createElement('div');
        button.className = 'option';
        button.textContent = option;
        button.onclick = () => checkAnswer(index);
        optionsContainer.appendChild(button);
    });

    document.getElementById('feedback').textContent = '';
    document.getElementById('next-btn').style.display = 'none';
}

// 정답 확인
function checkAnswer(selectedIndex) {
    const options = document.querySelectorAll('.option');
    const feedback = document.getElementById('feedback');
    
    options.forEach(option => option.onclick = null);
    
    if (selectedIndex === currentQuiz.correctAnswer) {
        options[selectedIndex].classList.add('correct');
        feedback.textContent = '정답입니다!';
        score.correct++;
    } else {
        options[selectedIndex].classList.add('wrong');
        options[currentQuiz.correctAnswer].classList.add('correct');
        feedback.textContent = '틀렸습니다.';
    }
    
    score.total++;
    document.getElementById('next-btn').style.display = 'block';
}

// 다음 문제로 이동
function nextQuestion() {
    const subjectQuizzes = quizzes.filter(quiz => quiz.subject === currentSubject);
    
    if (score.total >= subjectQuizzes.length) {
        showResult();
    } else {
        currentQuiz = getRandomQuiz(currentSubject);
        displayQuiz();
    }
}

// 결과 표시
function showResult() {
    showScreen('quiz-result');
    document.getElementById('correct-count').textContent = score.correct;
    document.getElementById('total-count').textContent = score.total;
    document.getElementById('accuracy').textContent = 
        Math.round((score.correct / score.total) * 100);
}

// 페이지 로드 시 기본 퀴즈 데이터 추가
window.addEventListener('load', function() {
    // localStorage에 저장된 퀴즈가 없을 경우에만 기본 데이터 추가
    if (!localStorage.getItem('quizzes')) {
        localStorage.setItem('quizzes', JSON.stringify(sampleQuizzes));
        quizzes = sampleQuizzes;
    }
});

// fetchQuizzes 함수 수정
async function fetchQuizzes() {
    try {
        const OPENAI_API_KEY = 'API KEY 입력'; // 여기에 OpenAI API 키를 입력하세요
        const subjects = ["한국사", "상식", "과학"];
        const newQuizzes = [];
        
        // 각 과목별로 10개의 퀴즈 생성 요청
        for (const subject of subjects) {
            const prompt = `${subject} 관련 4지선다형 퀴즈 10개를 생성해주세요. 
            다음 JSON 형식으로 응답해주세요:
            {
                "quizzes": [
                    {
                        "question": "질문",
                        "options": ["정답", "오답1", "오답2", "오답3"],
                        "correctAnswer": 0
                    }
                ]
            }
            정답은 항상 options 배열의 첫 번째 요소(인덱스 0)로 설정해주세요.`;

            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${OPENAI_API_KEY}`
                },
                body: JSON.stringify({
                    model: "gpt-3.5-turbo",
                    messages: [{
                        role: "user",
                        content: prompt
                    }],
                    temperature: 0.7
                })
            });

            const data = await response.json();
            const generatedQuizzes = JSON.parse(data.choices[0].message.content).quizzes;

            // 생성된 퀴즈를 형식에 맞게 변환하여 추가
            generatedQuizzes.forEach(quiz => {
                newQuizzes.push({
                    subject: subject,
                    question: quiz.question,
                    options: quiz.options,
                    correctAnswer: 0
                });
            });
        }

        // 퀴즈 순서를 랜덤으로 섞기
        const shuffledQuizzes = newQuizzes.sort(() => Math.random() - 0.5);
        
        // 기존 퀴즈에 새 퀴즈 추가
        quizzes = [...quizzes, ...shuffledQuizzes];
        localStorage.setItem('quizzes', JSON.stringify(quizzes));
        
        alert('새로운 퀴즈가 추가되었습니다! (각 과목별 10개)');
    } catch (error) {
        alert('퀴즈 생성에 실패했습니다.');
        console.error('Error:', error);
    }
}

// 퀴즈 가져오기 버튼 추가를 위한 HTML 수정이 필요합니다
