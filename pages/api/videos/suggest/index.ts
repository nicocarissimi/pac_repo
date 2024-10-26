import { CategoryInterface } from "@/libs/definitions";
import serverAuth from "@/libs/serverAuth";
import { NextApiRequest, NextApiResponse } from "next";

async function GET(learning_time: number, favoriteCategories: string[] ){
        // candidates i a list of combinations so a list of list
        const solution = []
        // if duration > learning_time automatically video can't be inside a valid candidate
        // where candidate is a combination of video where the sum all video durations is less than or equals to learning_time value
        const result = await prismadb.video.findMany({
            where: {
                duration: {
                    lte: learning_time
                },
                categories: {
                    some: {
                        category: {
                            name: {
                                in: favoriteCategories
                            }
                        }
                    }
                }
            },
            select: {
                id: true,
                title: true,
                description: true,
                thumbnailUrl: true,
                videoUrl: true,
                duration: true,
                categories: {
                    where: {
                        category: {
                            name: {
                                in: favoriteCategories
                            }
                        }
                    },
                    select: {
                        category: {
                            select: {
                                name: true
                            }
                        }
                    }
                }
            }
        });

        
        var videos = result.map(video => ({
            ...video,
            categories: video.categories.map(cat => cat.category.name)
        }));

        var total = 0
        if(videos.length > 0) {
            videos.sort((a,b) => a.categories.length - b.categories.length)[videos.length]
            const video = videos.pop()
            total += video!.duration
            solution.push(video)
        }


        while( videos.length > 0 && total < learning_time) {
            // sort all candidates and choose the first one which has the most categories number
            // once i selected the first candidates the algorithm must select the best candidates looking for the amount of category not already included in the solution list
            const selectedVideo = candidateSelection(solution, videos)
            if (selectedVideo.duration + total < learning_time) {
                solution.push(selectedVideo)
                total += selectedVideo.duration
            }
            videos = videos.filter(video => video !== selectedVideo)
        }

        return solution

}

// the candidates must satisfy duration condition and to have more categories than other candidates which aren't already in solution list
function candidateSelection(solution: any[], videos:  any[]){
    let maxVideo = null;
    let maxCount = 0;
    let minDuration = 0 
    for ( const video of videos){
        const count = video.categories.filter((category: CategoryInterface) => !solution.includes(category)).length
        if (count > maxCount) {
            maxCount = count;
            maxVideo = video;
            minDuration = video.duration
        }
        if( count == maxCount && video.duration < minDuration){
            maxCount = count;
            maxVideo = video;
            minDuration = video.duration
        }
    }
    return maxVideo
}



export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const {currentUser} = await serverAuth(req)
    if (req.method === 'GET') {
        if(currentUser.learning_time && currentUser.learning_time > 0) {
            const {favoriteCategories, learning_time} = currentUser
            const categories = favoriteCategories.map(c=>c.category.name)
            const videos = await GET(15, categories)
            return res.status(200).json(videos)    
        }
        return res.status(200).json({})
    }

}