from pydantic import BaseModel, Field
from langchain_core.prompts import PromptTemplate, ChatPromptTemplate
from langchain_openai import ChatOpenAI
from langchain_core.output_parsers import StrOutputParser, PydanticOutputParser
from dotenv import load_dotenv


class QuestionAnswerChain:

    def __init__(self, doc, is_resume) -> None:
        load_dotenv()
        self.doc = doc
        self.is_resume = is_resume

    def invoke(self, count):
        
        class QuestionAndAnswer(BaseModel):
            questions_and_answers: list[dict] = Field(
                                ..., min_length=count, max_length=count,
                                example=[{"question": "What is the capital of France?", "answer": "Paris"}, {"question": "Who painted the Mona Lisa?", "answer": "Leonardo da Vinci"}]
                            )
        
        if self.is_resume:
            template = """
            You are AutoScreener, a technical screener tool which is used by an interviewer to generate technical interview questions.
            You will be provided a resume, based on which you must generate {count} technical questions, along with a sample answers for each which will test the in-depth knowledge of the candidate.

            Generate set of questions and answers from the resume
            {document}

            Adjust the difficulty of questions according to the experience of the candidate

            {format_instructions}
            Answer:
            """
        else:
            template = """
            You are AutoScreener, a technical screener tool which is used by an interviewer to generate technical interview questions.
            You will be provided a JD, based on which you must generate {count} technical questions, along with a sample answers for each which will test the in-depth knowledge of the candidate.

            The questions should be based only on the skills and job title, not on the company details and other info

            Generate set of technical questions and answers
            {document}
            
            Adjust the difficulty of questions according to the experience of the candidate

            {format_instructions}
            Answer:
            """


        parser = PydanticOutputParser(pydantic_object=QuestionAndAnswer)

        model = ChatOpenAI(model="gpt-4o-mini", temperature=0.8)

        skill_prompt_template = PromptTemplate(
            template = template,
            partial_variables = {"format_instructions": parser.get_format_instructions()},
        )
        

        self.skill_chain = (
            skill_prompt_template 
            | model 
            | parser
        )
                    
        response = self.skill_chain.invoke({
            "count": count,
            "document": self.doc,
        })

        return response